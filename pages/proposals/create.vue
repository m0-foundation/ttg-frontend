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

            <component
              :is="selectedProposalType.component"
              v-if="selectedProposalType"
              v-model="formData.proposalValue"
              v-model:modelValue2="formData.proposalValue2"
              v-model:modelValue3="formData.proposalValue3"
              :placeholder="selectedProposalType.placeholder"
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
import {
  encodeFunctionData,
  encodeAbiParameters,
  keccak256,
  toHex,
} from "viem";
import { useAccount } from "use-wagmi";
import {
  ispogGovernorABI,
  writeIspogGovernor,
  writeIerc20,
  readIerc20,
  writeListFactory,
  ispogABI,
} from "@/lib/sdk";
import ProposalInputSingleNumber from "@/components/proposal/InputSingleNumber";
import ProposalInputRangeNumber from "@/components/proposal/InputRangeNumber";
import ProposalInputListOperation from "@/components/proposal/InputListOperation";
import ProposalInputSingleText from "@/components/proposal/InputSingleText";
import ProposalInputChangeConfig from "@/components/proposal/InputChangeConfig";

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
  proposalValue2: null,
  proposalValue3: null,
  description: null,
});

const { address: userAccount } = useAccount();

const config = useRuntimeConfig();
const spog = useSpogStore();

const proposalTypes = [
  {
    value: "Change Quorums",
    label: "Change Quorums",
    children: [
      {
        value: "updateVoteQuorumNumerator",
        label: "Vote Quorum",
        component: ProposalInputSingleNumber,
        modelValue: formData.proposalValue,
      },
      {
        value: "updateValueQuorumNumerator",
        label: "Value Quorum",
        component: ProposalInputSingleNumber,
      },
    ],
  },
  {
    value: "tax",
    label: "Tax",
    children: [
      {
        value: "changeTax",
        label: "Change Tax",
        component: ProposalInputSingleNumber,
      },
      {
        value: "changeTaxRange",
        label: "Change Tax range",
        component: ProposalInputRangeNumber,
      },
    ],
  },

  {
    value: "list",
    label: "List",
    children: [
      {
        value: "addList",
        label: "Create a new list",
        placeholder: "List name",
        component: ProposalInputSingleText,
      },
      {
        value: "append",
        label: "Append to a list",
        component: ProposalInputListOperation,
      },
      {
        value: "remove",
        label: "Remove from a list",
        component: ProposalInputListOperation,
      },
    ],
  },

  {
    value: "changeConfig",
    label: "Change Config",
    component: ProposalInputChangeConfig,
  },

  {
    value: "reset",
    label: "Reset",
    placeholder: "Governance Address",
    component: ProposalInputSingleText,
  },

  {
    value: "emergency",
    label: "Emergency",
    children: [
      {
        value: "append",
        label: "Append to a list",
        isEmergency: true,
        component: ProposalInputListOperation,
      },
      {
        value: "remove",
        label: "Remove from a list",
        isEmergency: true,
        component: ProposalInputListOperation,
      },
      {
        value: "changeConfig",
        label: "Change Config",
        isEmergency: true,
        component: ProposalInputChangeConfig,
      },
    ],
  },
];

const isEmergency = computed(
  () => selectedProposalType.value.isEmergency || false
);

function onChangeProposalType(option) {
  console.log("onChangeProposalType", { option });
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
    address: spog.contracts.cash,
    functionName: "allowance",
    args: [account, config.public.contracts.spog], // address owner, address spender
    account,
  });

  // TODO: allowance > tax  : check againts tax for create proposal
  const tax = 1n;
  if (allowance <= tax) {
    const { hash } = await writeIerc20({
      address: spog.contracts.cash,
      functionName: "approve",
      args: [config.public.contracts.spog, tax * BigInt(1e18)], // address spender, uint256 amount
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
    ? [spog.contracts.governor] // dual governor contract as target for dual governance proposals
    : [config.public.contracts.spog];

  const description = formData.description;
  const values = [0]; // do not change

  const { hash } = await writeIspogGovernor({
    address: spog.contracts.governor,
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
  const catchErrorStep = (error) => {
    console.error({ error });
    stepper.value.changeCurrentStep("error");
    throw error;
  };

  try {
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

    return navigateTo("/proposals/active");
  } catch (error) {
    console.error({ error });
    catchErrorStep(error);
  }
}

function buildCalldatasEmergency({ input1, input2, input3, type }) {
  const emergencyTypesMap = {
    append: 0,
    remove: 1,
    changeConfig: 2,
  };

  const emergencyType = emergencyTypesMap[type];
  console.log({ type, emergencyType });
  const valueEncoded = encodeAbiParameters(
    [{ type: "uint8" }],
    [BigInt(emergencyType)]
  );

  const valueEncoded2 =
    emergencyType === emergencyTypesMap.changeConfig
      ? encodeAbiParameters(
          [{ type: "string" }, { type: "string" }, { type: "string" }],
          [keccak256(toHex(input1)), input2, input3] // configName, configAddress, interfaceId
        )
      : encodeAbiParameters(
          [{ type: "string" }, { type: "string" }],
          [input1, input2] // list address, value
        );

  return buildCalldatasSpog("emergency", [valueEncoded, valueEncoded2]);
}

function buildCalldatas(formData) {
  const {
    proposalType: type,
    proposalValue: input1,
    proposalValue2: input2,
    proposalValue3: input3,
  } = formData;

  if (["addList"].includes(type)) {
    return buildCalldatasSpog(type, [input1]);
  }

  if (["append", "remove"].includes(type)) {
    if (isEmergency.value) {
      return buildCalldatasEmergency({
        type,
        input1,
        input2,
        input3,
      });
    }
    // TODO? add checkers if inputs are  addresses that instances of smartcontracts ILIST
    // list, address
    return buildCalldatasSpog(type, [input1, input2]);
  }

  if (["changeConfig"].includes(type)) {
    if (isEmergency.value) {
      return buildCalldatasEmergency({
        type,
        input1,
        input2,
        input3,
      });
    }

    const valueEnconded = keccak256(toHex(input1));
    return buildCalldatasSpog(type, [valueEnconded, input2, input3]);
  }

  if (["reset"].includes(type)) {
    // TODO? add checkers if inputs are  addresses that instances of smartcontracts ISPOG
    return buildCalldatasSpog(type, [input1, spog.contracts.voteVault]);
  }

  if (["changeTax"].includes(type)) {
    const valueEncoded = encodeAbiParameters(
      [{ type: "uint256" }],
      [BigInt(input1 * 1e18)] // tax is using 18 decimals precision
    );
    return buildCalldatasSpog(type, [valueEncoded]);
  }

  if (["changeTaxRange"].includes(type)) {
    const value1Encoded = encodeAbiParameters(
      [{ type: "uint256" }],
      [BigInt(input1 * 1e18)] // tax is using 18 decimals precision
    );
    const value2Encoded = encodeAbiParameters(
      [{ type: "uint256" }],
      [BigInt(input2 * 1e18)] // tax is using 18 decimals precision
    );
    return buildCalldatasSpog(type, [value1Encoded, value2Encoded]);
  }

  if (
    ["updateValueQuorumNumerator", "updateVoteQuorumNumerator"].includes(type)
  ) {
    const valueEncoded = encodeAbiParameters(
      [{ type: "uint256" }],
      [BigInt(input1 * 1e18)] // tax is using 18 decimals precision
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
