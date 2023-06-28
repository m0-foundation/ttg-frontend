<template>
  <div>
    <MModal ref="modal" @on-closed="onCloseModal">
      <MTransactionsStepper ref="stepper" :steps="steps" />
    </MModal>
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

            <!-- number input type -->
            <div
              v-if="
                [
                  'changeTax',
                  'updateVoteQuorumNumerator',
                  'updateValueQuorumNumerator',
                ].includes(formData.proposalType)
              "
              class="w-full flex justify-between items-center space-x-4"
            >
              <input
                v-model="formData.proposalValue"
                data-test="proposalValue"
                type="number"
              />
              <div class="w-1/2">current: X.XX</div>
            </div>

            <!-- numbers range input type -->
            <div
              v-else-if="['changeTaxRange'].includes(formData.proposalType)"
              class="w-full flex justify-between items-center space-x-4"
            >
              <input
                v-model="formData.proposalValue"
                data-test="proposalValue"
                type="number"
                placeholder="From"
              />
              <input
                v-model="formData.proposalValue2"
                data-test="proposalValue2"
                name="proposalValue2"
                type="number"
                placeholder="To"
              />
              <div class="w-1/2">current: X.XX</div>
            </div>

            <!-- list operations input type -->
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
                data-test="proposalValue"
                type="text"
                placeholder="Address"
              />
              <input
                v-model="formData.proposalValue2"
                name="proposalValue2"
                type="text"
                placeholder="List Address"
              />
              <div class="w-1/2">TAX: X.XX $CASH</div>
            </div>

            <!-- text input type -->
            <input
              v-else-if="'addList' === formData.proposalType"
              v-model="formData.proposalValue"
              data-test="proposalValue"
              type="text"
              placeholder="List Name"
            />

            <!-- address text input type -->
            <input
              v-else
              v-model="formData.proposalValue"
              data-test="proposalValue"
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
import { hardhat } from "viem/chains";
import {
  ispogGovernorABI,
  writeIspogGovernor,
  writeIerc20,
  readIerc20,
  writeListFactory,
  ispogABI,
} from "@/lib/sdk";

/* control stepper */
let steps = reactive([]);

const stepper = ref(null);
const modal = ref(null);

function onCloseModal() {
  stepper.value.reset();
  throw new Error("rejected by user");
}

/* control Form */

const isPreview = ref(false);
const selectedProposalType = ref();
const isWritting = ref(false);

const formData = reactive({
  proposalType: null,
  proposalValue: null,
  description: null,
});

const { address: userAccount } = useAccount();
console.log({ userAccount });

const config = useRuntimeConfig();

const proposalTypes = [
  {
    value: "Change Quorums",
    label: "Change Quorums",
    children: [
      {
        value: "updateVoteQuorumNumerator",
        label: "Vote Quorum",
      },
      {
        value: "updateValueQuorumNumerator",
        label: "Value Quorum",
      },
    ],
  },
  {
    value: "Tax",
    label: "Tax",
    children: [
      {
        value: "changeTax",
        label: "Change Tax",
      },
      {
        value: "changeTaxRange",
        label: "Change Tax range",
      },
    ],
  },
  {
    value: "addList",
    label: "Create a new list",
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
];

function onChangeProposalType(option) {
  formData.proposalType = option.value;
  selectedProposalType.value = option;
}

function onPreview() {
  isPreview.value = true;
}

async function writeAllowance() {
  const account = userAccount.value;
  console.log({ account });
  // It needs approval to pay for taxes
  const allowance = await readIerc20({
    address: config.public.contracts.tokens.cash,
    functionName: "allowance",
    args: [account, config.public.contracts.spog], // address owner, address spender
    account,
  });

  console.log({ allowance });

  // TODO: allowance > tax  : check againts tax for create proposal
  const tax = 1n;
  if (allowance <= tax) {
    const { hash } = await writeIerc20({
      address: config.public.contracts.tokens.cash,
      functionName: "approve",
      args: [config.public.contracts.spog, tax * BigInt(10e18)], // address spender, uint256 amount
      account,
    });

    stepper.value.changeCurrentStep("pending");

    const txReceipt = await waitForTransaction({
      confirmations: 1,
      hash,
    });
    // Fail tx
    if (txReceipt.status !== "success") {
      throw new Error("Transaction was not successful");
    }

    return txReceipt;
  }
}

async function writeDeployList(listName) {
  const account = userAccount.value;
  const listItems = [];
  const listSalt = random(1e10); // generate a integer from 0 to 1e10 to be used as salt since it can be repated

  const { hash } = await writeListFactory({
    address: config.public.contracts.listFactory,
    functionName: "deploy",
    // address _spog, string  _name, address[] memory addresses, uint256 _salt
    args: [config.public.contracts.spog, listName, listItems, listSalt],
    account,
    overrides: {
      gasLimit: 2100000n,
    },
  });

  if (!hash) {
    throw new Error("Faild on create new list");
  }

  stepper.value.changeCurrentStep("pending");

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

  return newListAddress;
}

async function writeProposal(calldatas, formData) {
  const account = userAccount.value;
  const targets = [
    "updateValueQuorumNumerator",
    "updateVoteQuorumNumerator",
  ].includes(formData.proposalType)
    ? [config.public.contracts.governor] // dual governor contract as target for dual governance proposals
    : [config.public.contracts.spog];

  const description = formData.description;
  const values = [0]; // do not change

  const { hash } = await writeIspogGovernor({
    address: config.contracts.governor,
    functionName: "propose",
    args: [targets, values, [calldatas], description],
    account,
    overrides: {
      gasLimit: 2100000n,
    },
  });

  stepper.value.changeCurrentStep("pending");

  const txReceipt = await waitForTransaction({
    confirmations: 1,
    hash,
  });
  // Fail tx
  if (txReceipt.status !== "success") {
    throw new Error("Transaction was rejected");
  }

  return txReceipt;
}

async function onSubmit() {
  try {
    const catchErrorStep = (error) => {
      console.error({ error });
      stepper.value.changeCurrentStep("error");
      throw error;
    };

    steps = reactive(
      formData.proposalType === "addList"
        ? [
            {
              title: "Deploy new List",
              status: "current",
            },
            {
              title: "Allowance",
              status: "incomplete",
            },
            {
              title: "Create Proposal",
              status: "incomplete",
            },
            {
              title: "Confirmation",
              status: "incomplete",
            },
          ]
        : [
            {
              title: "Allowance",
              status: "current",
            },
            {
              title: "Create Proposal",
              status: "incomplete",
            },
            {
              title: "Confirmation",
              status: "incomplete",
            },
          ]
    );

    modal.value.open();

    if (formData.proposalType === "addList") {
      const addListAddress = await writeDeployList(
        formData.proposalValue
      ).catch(catchErrorStep);

      formData.proposalValue = addListAddress;

      stepper.value.nextStep();
    }

    await writeAllowance().catch(catchErrorStep);

    stepper.value.nextStep();

    const calldatas = buildCalldatas(formData);
    await writeProposal(calldatas, formData).catch(catchErrorStep);

    stepper.value.nextStep();
    stepper.value.changeCurrentStep("complete");
  } catch (error) {
    console.error({ error });
  }
}

function buildCalldatas(formData) {
  const {
    proposalType: type,
    proposalValue: input1,
    proposalValue2: input2,
  } = formData;
  console.log({ type, input1, input2 });

  if (["addList"].includes(type)) {
    return buildCalldatasSpog(type, [input1]);
  }

  if (["append", "remove"].includes(type)) {
    // TODO? add checkers if inputs are  addresses that instances of smartcontracts ILIST
    return buildCalldatasSpog(type, [input1, input2]);
  }

  if (["reset"].includes(type)) {
    // TODO? add checkers if inputs are  addresses that instances of smartcontracts ISPOG
    return buildCalldatasSpog(type, [
      input1,
      config.public.contracts.vault.vote,
    ]);
  }

  if (["changeTax"].includes(type)) {
    const valueEncoded = encodeAbiParameters(
      [{ type: "uint256" }],
      [BigInt(input1 * 10e18)] // tax is using 18 decimals precision
    );
    return buildCalldatasSpog(type, [valueEncoded]);
  }

  if (["changeTaxRange"].includes(type)) {
    const value1Encoded = encodeAbiParameters(
      [{ type: "uint256" }],
      [BigInt(input1 * 10e18)] // tax is using 18 decimals precision
    );
    const value2Encoded = encodeAbiParameters(
      [{ type: "uint256" }],
      [BigInt(input2 * 10e18)] // tax is using 18 decimals precision
    );
    return buildCalldatasSpog(type, [value1Encoded, value2Encoded]);
  }

  if (
    ["updateValueQuorumNumerator", "updateVoteQuorumNumerator"].includes(type)
  ) {
    const valueEncoded = encodeAbiParameters(
      [{ type: "uint256" }],
      [BigInt(input1 * 10e18)] // tax is using 18 decimals precision
    );
    return buildCalldatasGovernor(type, [valueEncoded]);
  }
}

function buildCalldatasSpog(functionName, args) {
  return encodeFunctionData({ abi: ispogABI, functionName, args });
}

function buildCalldatasGovernor(functionName, args) {
  return encodeFunctionData({ abi: ispogGovernorABI, functionName, args });
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
