<template>
  <div>
    <form @submit.prevent="onSubmit">
      <div v-if="isWritting">Writting transaction on blockchain...</div>
      <div v-else>
        <div v-if="!isPreview">
          <h1>Create a proposal</h1>

          <div class="mb-6">
            <label for="proposal-type">Proposal type</label>
            <MInputMultiSelect
              :options="proposalTypes"
              @on-change="onChangeProposalType"
            />
          </div>

          <div v-show="formData.proposalType" class="mb-6">
            <label for="type-value">{{ selectedProposalType?.label }}</label>

            <!-- number input value -->
            <div
              v-if="['changeTax'].includes(formData.proposalType)"
              class="w-full flex justify-between items-center space-x-4"
            >
              <input v-model="formData.proposalValue" type="number" />
              <div class="w-1/2">current: X.XX</div>
            </div>

            <div
              v-else-if="['taxRange'].includes(formData.proposalType)"
              class="w-full flex justify-between items-center space-x-4"
            >
              <input
                v-model="formData.proposalValue"
                type="number"
                placeholder="From"
              />
              <input
                v-model="formData.proposalValue2"
                type="number"
                placeholder="To"
              />
              <div class="w-1/2">current: X.XX</div>
            </div>

            <div
              v-else-if="
                ['append', 'remove', 'emergencyRemove'].includes(
                  formData.proposalType
                )
              "
              class="w-full flex justify-between items-center space-x-4"
            >
              <input
                v-model="formData.proposalValue"
                type="text"
                placeholder="Address"
              />
              <input
                v-model="formData.proposalValue2"
                type="text"
                placeholder="List Address"
              />
              <div class="w-1/2">TAX: X.XX $CASH</div>
            </div>

            <input
              v-else
              v-model="formData.proposalValue"
              type="text"
              placeholder="Address"
            />
          </div>

          <div class="mb-6">
            <div class="flex justify-between mb-2">
              <label for="description"> Description </label>
              <div class="text-sm text-gray-400 flex">
                <img src="/img/icon-markdown.svg" class="h-6 mx-2" />
                Markdown supported
              </div>
            </div>

            <textarea v-model="formData.description" name="description" />
          </div>
        </div>

        <div v-else>
          <ProposalPreview
            :description="formData.description"
            @on-back="onBack"
          />
        </div>
      </div>

      <div v-if="isPreview" class="flex justify-end mt-12">
        <button class="text-primary-dark uppercase mx-4" @click="onBack">
          &#60; back
        </button>
        <MButton v-if="isPreview" type="submit">Submit proposal</MButton>
      </div>

      <div v-else class="flex justify-end mt-12">
        <MButton type="button" @click="onPreview">Preview proposal</MButton>
      </div>

      <hr class="my-12" />

      <div id="info-text" class="mb-6">
        <h2 class="text-white">
          What is the standard for Governor proposal descriptions?
        </h2>
        <div class="text-sm text-grey-primary">
          <p>
            Ever since Governor proposals have had an on-chain, human-readable
            description field. Governor front ends like Tally, Compound and
            others follow this de-facto standard:
          </p>
          <ul>
            <li>• Proposal descriptions should be markdown text</li>
            <li>
              • The first line of the description, regardless of format, is the
              title
            </li>
            <li>
              • Everything after the first newline is the body of the proposal.
              Frontends should renderer it as markdown
            </li>
          </ul>
          <p>
            If a proposal description does not follow this standard, Tally's
            frontend will make a best-effort to render it, but it might look
            weird.
          </p>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import get from "lodash/get";
import random from "lodash/random";
import { ref } from "vue";
import { waitForTransaction } from "@wagmi/core";
import { encodeFunctionData, encodeAbiParameters } from "viem";
import { useAccount } from "use-wagmi";
import {
  ispogABI,
  writeIGovernor,
  writeIerc20,
  readIerc20,
  writeListFactory,
} from "@/lib/sdk";

const isPreview = ref(false);
const selectedProposalType = ref();
const isWritting = ref(false);

const formData = reactive({
  proposalType: null,
  proposalValue: null,
  description: null,
});

const { address: userAccount } = useAccount();

const config = useRuntimeConfig();

const proposalTypes = [
  {
    value: "addList",
    label: "Create a new List",
  },

  {
    value: "append",
    label: "Append an address to a list",
  },

  {
    value: "remove",
    label: "Remove an address from a list",
  },

  {
    value: "reset",
    label: "New Governance",
  },

  {
    value: "changeTax",
    label: "Change tax",
  },
];

function onChangeProposalType(option) {
  formData.proposalType = option.value;
  selectedProposalType.value = option;
}

function onPreview() {
  isPreview.value = true;
}

async function onSubmit() {
  try {
    // It needs approval to pay for taxes
    const allowance = await readIerc20({
      address: config.public.contracts.tokens.cash,
      functionName: "allowance",
      args: [userAccount.value, config.public.contracts.spog], // address owner, address spender
      account: userAccount.value,
    }).then((bigNumber) => bigNumber.toBigInt());

    console.log({ allowance });

    // TODO: allowance > tax  : check againts tax for create proposal
    const tax = 0n;
    if (allowance <= tax) {
      await writeIerc20({
        address: config.public.contracts.tokens.cash,
        functionName: "approve",
        args: [config.public.contracts.spog, 100], // address spender, uint256 amount
        account: userAccount.value,
      });
    }

    const calldatas = buildCalldatas(formData);

    isWritting.value = true;
    const { hash } = await onWriteSpogGovernor({
      calldatas: [calldatas],
      description: formData.description,
    });

    const txReceipt = await waitForTransaction({
      confirmations: 1,
      hash,
    });
    // Fail tx
    if (txReceipt.status === 0) {
      throw new Error("Transaction was rejected");
    }

    isWritting.value = false;
  } catch (error) {
    console.error({ error });
  }
}

async function buildCalldatas(data) {
  const type = data.proposalType;

  if (["addList"].includes(type)) {
    const listName = data.proposalValue;
    const listItems = [];
    const listSalt = random(1e10); // generate a integer from 0 to 1e10 to be used as salt since it can be repated
    const { hash } = await writeListFactory({
      address: config.public.contracts.listFactory,
      functionName: "deploy",
      // address _spog, string  _name, address[] memory addresses, uint256 _salt
      args: [config.public.contracts.spog, listName, listItems, listSalt],
      account: userAccount.value,
      chainId: 11155111,
      overrides: {
        gasLimit: 2100000n,
      },
    });

    if (!hash) {
      throw new Error("Faild on create new list");
    }

    const txReceipt = await waitForTransaction({
      confirmations: 1,
      hash,
    });

    console.log({ txReceipt });

    const newListAddress = get(txReceipt, "logs[0].address");

    if (!newListAddress) {
      throw new Error("Faild on create new list");
    }
    console.log({ newListAddress });

    return buildCalldatasBase("addList", [newListAddress]);
  }

  if (["append", "remove"].includes(type)) {
    // TODO? add checkers if inputs are  addresses that instances of smartcontracts ILIST
    return buildCalldatasBase(type, [data.proposalValue, data.proposalValue2]);
  }

  if (["reset"].includes(type)) {
    // TODO? add checkers if inputs are  addresses that instances of smartcontracts ISPOG
    return buildCalldatasBase(type, [
      data.proposalValue,
      config.public.contracts.vault.vote,
    ]);
  }

  if (["changeTax"].includes(type)) {
    const valueEncoded = encodeAbiParameters(
      [{ type: "uint256" }],
      [BigInt(data.proposalValue * 10e18)] // tax is using 18 decimals precision
    );
    return buildCalldatasBase("changeTax", [valueEncoded]);
  }
}

function buildCalldatasBase(functionName, args) {
  return encodeFunctionData({ abi: ispogABI, functionName, args });
}

function onWriteSpogGovernor({ calldatas, description }) {
  const targets = [config.public.contracts.spog]; // do not change
  const values = [0]; // do not change

  return writeIGovernor({
    address: config.contracts.governor,
    functionName: "propose",
    args: [targets, values, calldatas, description],
    account: userAccount.value,
    chainId: 11155111,
    overrides: {
      gasLimit: 2100000n,
    },
  });
}

function onBack() {
  isPreview.value = false;
}
</script>

<style scoped>
h1 {
  @apply text-3xl font-light mb-12;
}

label {
  @apply text-grey-primary block mb-2 text-sm font-medium;
}

input,
select,
textarea {
  @apply bg-secondary-dark border border-grey-secondary text-gray-100 text-sm focus:ring-green-500 focus:border-green-100 block w-full p-2.5;
}

textarea {
  @apply h-80;
}

hr {
  border-top: 1px dashed #979797;
}

#info-text * {
  @apply my-4;
}
</style>
