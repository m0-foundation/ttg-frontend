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
              v-if="
                [
                  'inflator',
                  'time',
                  'voteQuorum',
                  'valueQuorum',
                  'changeTax',
                ].includes(formData.proposalType)
              "
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

          <div class="mb-6">
            <label for="url-ipfs">IPFS</label>
            <input v-model="formData.ipfs" type="url" />
          </div>

          <div class="mb-6">
            <label for="url-discussion">Discussion</label>

            <input v-model="formData.discussion" type="url" />
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
import { ref } from "vue";
import { encodeFunctionData, toBytes, toHex, encodeAbiParameters } from "viem";
import { useAccount } from "use-wagmi";
import { spogABI, writeSpog, writeErc20 } from "@/lib/generated";

const isPreview = ref(false);
const selectedProposalType = ref();
const isWritting = ref(false);

const formData = reactive({
  proposalType: null,
  proposalValue: null,
  description: null,
  discussion: null,
  ipfs: null,
});

const { address: userAccount } = useAccount();

const config = useRuntimeConfig();

const proposalTypes = [
  {
    value: "Change parameters",
    label: "Change parameters",
    children: [
      {
        value: "cash",
        label: "cash",
      },
      {
        value: "taxRange",
        label: "taxRange",
      },
      {
        value: "inflator",
        label: "inflator",
      },

      {
        value: "time",
        label: "time",
      },
      {
        value: "voteQuorum",
        label: "voteQuorum",
      },
      {
        value: "valueQuorum",
        label: "valueQuorum",
      },
    ],
  },
  {
    value: "changeTax",
    label: "Change tax",
  },

  {
    value: "addNewList",
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
    value: "emergencyRemove",
    label: "Emergency Remove",
  },
];

function onChangeProposalType(option) {
  console.log({ option });
  formData.proposalType = option.value;
  selectedProposalType.value = option;
}

function onPreview() {
  isPreview.value = true;
}

async function onSubmit() {
  console.log("submit");

  // TODO: add this process somewhere else
  // it needs to approve to pay for tax
  // const allowance = await writeErc20({
  //   address: config.cash,
  //   functionName: "approve",
  //   args: [config.spog, 100],
  //   account: address.value,
  // });
  // console.log({ allowance });

  const calldatas = buildCalldatas(formData);
  console.log({ calldatas });

  isWritting.value = true;
  const { hash } = await onWriteSpogGovernor({
    calldatas,
    description: formData.description,
  });
  isWritting.value = false;
}

function buildCalldatas(data) {
  const type = data.proposalType;

  if (
    ["changeTax", "inflator", "time", "voteQuorum", "valueQuorum"].includes(
      type
    )
  ) {
    return buildCalldatasChange(data, "uint256");
  }

  if (["cash"].includes(type)) {
    return buildCalldatasChange(data, "address");
  }

  if (["taxRange"].includes(type)) {
    return buildCalldatasChangeDoubleValues(data, "uint256[2]");
  }

  if (["append", "remove", "emergencyRemove"].includes(type)) {
    return buildCalldatasForList(data);
  }
}

function buildCalldatasForList(data) {
  const functionName = data.proposalType;
  const args = [data.proposalValue, data.proposalValue2];
  return [encodeFunctionData({ abi: spogABI, functionName, args })];
}

function buildCalldatasChange(data, inputType) {
  console.log("buildCalldatasChange", { data, inputType });

  const what = toBytes(data.proposalType, { size: 32 });
  const valueEncoded = encodeAbiParameters(
    [{ type: inputType }],
    [data.proposalValue]
  );

  return [
    encodeFunctionData({
      abi: spogABI,
      functionName: "change", // change(bytes32 what, bytes calldata value)
      args: [toHex(what), valueEncoded],
    }),
  ];
}

function buildCalldatasChangeDoubleValues(data, inputType) {
  console.log("buildCalldatasChangeDoubleValues", { data, inputType });

  const what = toBytes(data.proposalType, { size: 32 });
  const value2Encoded = encodeAbiParameters(
    [{ type: inputType }],
    [[data.proposalValue, data.proposalValue2]]
  );

  return [
    encodeFunctionData({
      abi: spogABI,
      functionName: "change", // change(bytes32 what, bytes calldata value)
      args: [toHex(what), value2Encoded],
    }),
  ];
}

async function onWriteSpogGovernor({ calldatas, description }) {
  const targets = [config.contracts.spog]; // do not change
  const values = [0]; // do not change

  const { hash } = await writeSpog({
    address: config.contracts.spog,
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
