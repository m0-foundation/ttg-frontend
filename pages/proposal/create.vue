<template>
  <div>
    <MModal ref="modal" @on-closed="onCloseModal">
      <MTransactionsStepper
        ref="stepper"
        title="Submitting your proposal"
        :steps="steps"
      />
    </MModal>
    <form class="p-6" @submit.prevent="onSubmit">
      <div v-if="isWritting">Writting transaction on blockchain...</div>
      <div v-else>
        <div v-show="!isPreview">
          <h1>Create a proposal</h1>

          <div class="create-steps">
            <div class="number">[1]</div>
            <span>Define the action to be executed if proposal succeeds</span>
          </div>

          <div>
            <label for="proposal-type">Proposal type</label>
            <MInputMultiSelect
              :options="proposalTypes"
              data-test="proposalTypeSelect"
              @on-change="onChangeProposalType"
            />
          </div>

          <div class="gap-4 flex mt-2 mb-4">
            <div v-for="token in selectedProposalType?.tokens" :key="token">
              <div
                v-if="token === MVotingTokens.Power"
                class="p-4 bg-green-900"
              >
                <div class="mb-2">
                  <p class="uppercase text-xxs">Standard Proposal</p>
                </div>

                <div class="flex gap-4">
                  <MIconPower class="w-[24px] h-[24px]" />
                  <div>
                    <span class="font-inter text-grey-100">
                      Only holders who possess active
                      <u>{{ MVotingTokens.Power }} tokens</u> will be eligible
                      to participate in voting for or against the selected
                      proposal type.
                    </span>
                  </div>
                </div>

                <div
                  v-if="selectedProposalType?.hasToPayFee"
                  class="flex gap-4 mt-3"
                >
                  <img src="/img/vote.svg" class="w-[24px] h-[24px]" alt="" />
                  <div>
                    <span class="font-inter text-grey-100"
                      >Simple majority wins</span
                    >
                  </div>
                </div>
              </div>

              <div v-if="token === MVotingTokens.Zero" class="p-4 bg-green-900">
                <div class="mb-2">
                  <p class="uppercase text-xxs">Standard Proposal</p>
                </div>
                <div class="flex gap-4">
                  <MIconZero class="w-[24px] h-[24px]" />
                  <div>
                    <span class="font-inter text-grey-100">
                      Only holders who possess active
                      <u>{{ MVotingTokens.Zero }} tokens</u> will be eligible to
                      participate in voting for or against the selected proposal
                      type.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div :class="{ disabled: selectedProposalType === undefined }">
            <div v-show="formData.proposalType">
              <component
                :is="selectedProposalType.component"
                v-if="selectedProposalType"
                v-model="formData.proposalValue"
                v-model:modelValue2="formData.proposalValue2"
                v-model:modelValue3="formData.proposalValue3"
                :model-value-errors="$validation.proposalValue?.$errors"
                :model-value2-errors="$validation.proposalValue2?.$errors"
                :model-value3-errors="$validation.proposalValue3?.$errors"
                :placeholder="selectedProposalType.placeholder"
                :current-value="currentValue"
                :selected-proposal-type="selectedProposalType"
              />
            </div>

            <div class="create-steps">
              <div class="number">[2]</div>
              <span>Name your proposal and add description</span>
            </div>

            <div class="mb-6">
              <label for="title-input">Title*</label>
              <MInput
                id="title-input"
                v-model="formData.title"
                data-test="title"
                type="text"
                placeholder="Title"
                :errors="$validation.title.$errors"
                class="font-inter"
              />
            </div>

            <div class="mb-6">
              <div class="flex justify-between mb-2">
                <label for="description">Description*</label>
                <div
                  class="text-sm text-grey-400 flex items-center gap-1 font-inter"
                >
                  <img src="/img/icon-markdown.svg" class="h-[14px]" />
                  Markdown supported
                </div>
              </div>

              <MTextareaMarkdown
                v-model="formData.description"
                data-test="description"
                name="description"
                :errors="$validation.description.$errors"
                class="h-80 font-inter"
                :placeholder="descriptionPlaceHolder"
              />
            </div>

            <div class="mb-6">
              <label for="type-value">IPFS</label>

              <input
                v-model="formData.ipfsURL"
                type="text"
                placeholder="https://"
                data-test="create-proposal-input-url-ipfs"
                class="font-inter"
              />
            </div>

            <div class="mb-6">
              <label for="type-value">Discussion URL:</label>

              <input
                v-model="formData.discussionURL"
                type="text"
                placeholder="https://"
                data-test="create-proposal-input-url-discussion"
                class="font-inter"
              />
            </div>
          </div>
        </div>

        <div v-if="isPreview">
          <ProposalPreview
            :address="userAccount"
            :description="previewDescription"
            @on-back="onBack"
          />
        </div>
      </div>

      <div class="flex justify-end font-inter">
        <div class="flex items-center gap-2 text-lg">
          Submission tax:
          <div v-if="hasToPayFee" class="flex items-center gap-2">
            {{ spogValuesFormatted.setProposalFee }}
            <MIconWeth />
          </div>
          <div v-else class="flex items-center gap-2">
            0
            <MIconWeth />
          </div>
        </div>
      </div>
      <p class="text-grey-400 text-xs flex justify-end font-inter">
        You will be prompted to pay the tax for submitting the proposal.
      </p>

      <div v-if="isPreview" class="flex justify-end mt-12">
        <button
          class="text-green-800 uppercase mx-4"
          data-test="create-proposal-button-back-bottom"
          @click="onBack"
        >
          &#60; back
        </button>
        <MButton
          v-if="isPreview"
          type="submit"
          :disabled="isDisconnected"
          data-test="create-proposal-button-submit"
        >
          Submit proposal
        </MButton>
      </div>
      <div v-else class="flex justify-end mt-12">
        <MButton
          type="button"
          data-test="create-proposal-button-preview"
          @click="onPreview"
        >
          Preview and submit
        </MButton>
      </div>

      <p
        v-if="isDisconnected"
        class="flex justify-end text-xs text-red-500 mx-2 my-1"
      >
        Please connect wallet
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  waitForTransaction,
  erc20ABI,
  writeContract,
  readContract,
} from "@wagmi/core";
import {
  encodeFunctionData,
  encodeAbiParameters,
  toHex,
  stringToBytes,
  Hash,
} from "viem";
import { useAccount } from "use-wagmi";
import { required, minLength, maxLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { storeToRefs } from "pinia";
import {
  standardGovernorABI,
  emergencyGovernorABI,
  zeroGovernorABI,
} from "@/lib/sdk";
import ProposalInputListOperation from "@/components/proposal/InputListOperation.vue";
import ProposalInputListRemoveAddOperation from "@/components/proposal/InputListRemoveAddOperation.vue";
import ProposalInputProtocolConfigOperation from "@/components/proposal/InputProtocolConfigOperation.vue";
import InputGovernanceSetCashToken from "@/components/proposal/InputGovernanceSetCashToken.vue";
import InputGovernanceSetZeroProposalThreshold from "@/components/proposal/InputGovernanceSetZeroProposalThreshold.vue";
import InputGovernanceSetEmergencyProposalThreshold from "@/components/proposal/InputGovernanceSetEmergencyProposalThreshold.vue";
import InputGovernanceSetProposalFee from "@/components/proposal/InputGovernanceSetProposalFee.vue";

import { MVotingTokens } from "@/lib/api";

/* control stepper */
let steps = reactive([]);

const stepper = ref(null);
const modal = ref(null);

useHead({
  titleTemplate: "%s - Create proposal",
});

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
  title: null,
  description: null,
  ipfsURL: null,
  discussionURL: null,
});

const descriptionPlaceHolder = ` Paragraphs are separated by a blank line.

Two spaces at the end of a line produce a line break.

Text attributes _italic_, **bold**

Horizontal rule:
---

Bullet lists nested within numbered list:

  1. fruits
     * apple
     * banana
`;

const rules = computed(() => {
  const constRules = {
    description: { required, minLength: minLength(6) },
    title: { required, minLength: minLength(6) },
  };

  const type = selectedProposalType?.value?.value;

  if (["addToList", "removeFromList"].includes(type)) {
    return {
      proposalValue: { required },
      proposalValue2: {
        required,
        minLength: minLength(42),
        maxLength: maxLength(42),
      },
      proposalValue3: {},
      ...constRules,
    };
  }

  if (["removeFromAndAddToList"].includes(type)) {
    return {
      proposalValue: { required },
      proposalValue2: {
        required,
        minLength: minLength(42),
        maxLength: maxLength(42),
      },
      proposalValue3: {
        required,
        minLength: minLength(42),
        maxLength: maxLength(42),
      },
      ...constRules,
    };
  }

  if (["setKey"].includes(type)) {
    return {
      proposalValue: { required },
      proposalValue2: { required },
      proposalValue3: {},
      ...constRules,
    };
  }

  if (["setProposalFee", "setStandardProposalFee"].includes(type)) {
    return {
      proposalValue: { required },
      proposalValue2: {},
      proposalValue3: {},
      ...constRules,
    };
  }

  if (
    [
      "setEmergencyProposalThresholdRatio",
      "setZeroProposalThresholdRatio",
    ].includes(type)
  ) {
    return {
      proposalValue: { required },
      proposalValue2: {},
      proposalValue3: {},
      ...constRules,
    };
  }

  // default (type === "reset")
  return {
    proposalValue: {},
    proposalValue2: {},
    proposalValue3: {},
    ...constRules,
  };
});

const hasToPayFee = computed(() => {
  return selectedProposalType?.value?.hasToPayFee;
});

const $validation = useVuelidate(rules, formData);

const previewDescription = ref();

const { address: userAccount, isDisconnected } = useAccount();
const { forceSwitchChain } = useCorrectChain();
const spog = useSpogStore();
const { getValuesFormatted: spogValuesFormatted } = storeToRefs(spog);

const proposalTypes = [
  {
    header: "protocol",
  },
  {
    value: "addToList",
    label: "Add address",
    component: ProposalInputListOperation,
    tokens: [MVotingTokens.Power],
    governor: spog.contracts.standardGovernor,
    abi: standardGovernorABI,
    hasToPayFee: true,
    id: "addToList",
  },
  {
    value: "removeFromList",
    label: "Remove address",
    component: ProposalInputListOperation,
    tokens: [MVotingTokens.Power],
    governor: spog.contracts.standardGovernor,
    abi: standardGovernorABI,
    hasToPayFee: true,
    id: "removeFromList",
  },

  {
    value: "removeFromAndAddToList",
    label: "Replace address",
    component: ProposalInputListRemoveAddOperation,
    tokens: [MVotingTokens.Power],
    governor: spog.contracts.standardGovernor,
    abi: standardGovernorABI,
    hasToPayFee: true,
    id: "removeFromAndAddToList",
  },

  {
    value: "setKey",
    label: "Update protocol config",
    component: ProposalInputProtocolConfigOperation,
    tokens: [MVotingTokens.Power],
    governor: spog.contracts.standardGovernor,
    abi: standardGovernorABI,
    hasToPayFee: true,
    id: "protocolSetKey",
  },

  {
    header: "governance",
  },

  {
    value: "setProposalFee",
    label: "Proposal Fee",
    component: InputGovernanceSetProposalFee,
    tokens: [MVotingTokens.Power],
    governor: spog.contracts.standardGovernor,
    abi: standardGovernorABI,
    hasToPayFee: true,
  },

  {
    value: "setCashToken",
    label: "Cash Token",
    component: InputGovernanceSetCashToken,
    tokens: [MVotingTokens.Zero],
    governor: spog.contracts.zeroGovernor,
    abi: zeroGovernorABI,
    hasToPayFee: false,
  },

  {
    value: "setEmergencyProposalThresholdRatio",
    label: "Power threshold",
    component: InputGovernanceSetEmergencyProposalThreshold,
    modelValue: formData.proposalValue,
    tokens: [MVotingTokens.Zero],
    governor: spog.contracts.zeroGovernor,
    abi: zeroGovernorABI,
    hasToPayFee: false,
  },
  {
    value: "setZeroProposalThresholdRatio",
    label: "Zero threshold",
    component: InputGovernanceSetZeroProposalThreshold,
    tokens: [MVotingTokens.Zero],
    governor: spog.contracts.zeroGovernor,
    abi: zeroGovernorABI,
    hasToPayFee: false,
  },

  {
    value: "emergency",
    label: "Emergency",
    id: "menuEmergency",
    isEmergency: true,
    submenuText:
      "Emergency proposals it requires a POWER Threshold and is immediately votable and subsequently immediately executable rather than only being votable and executable in the future epochs.",
    children: [
      {
        value: "addToList",
        label: "Add address",
        isEmergency: true,
        component: ProposalInputListOperation,
        tokens: [MVotingTokens.Power],
        governor: spog.contracts.emergencyGovernor,
        abi: emergencyGovernorABI,
        hasToPayFee: false,
        id: "emergencyAddToList",
      },
      {
        value: "removeFromList",
        label: "Remove address",
        isEmergency: true,
        component: ProposalInputListOperation,
        tokens: [MVotingTokens.Power],
        governor: spog.contracts.emergencyGovernor,
        abi: emergencyGovernorABI,
        hasToPayFee: false,
        id: "emergencyRemoveFromList",
      },

      {
        value: "removeFromAndAddToList",
        label: "Update address",
        isEmergency: true,
        component: ProposalInputListRemoveAddOperation,
        tokens: [MVotingTokens.Power],
        governor: spog.contracts.emergencyGovernor,
        abi: emergencyGovernorABI,
        hasToPayFee: false,
        id: "emergencyRemoveFromAndAddToList",
      },
      {
        value: "setStandardProposalFee",
        label: "Proposal fee",
        isEmergency: true,
        component: InputGovernanceSetProposalFee,
        tokens: [MVotingTokens.Power],
        governor: spog.contracts.emergencyGovernor,
        abi: emergencyGovernorABI,
        hasToPayFee: false,
        id: "emergencySetStandardProposalFee",
      },
      {
        value: "setKey",
        label: "Update protocol config",
        isEmergency: true,
        component: ProposalInputProtocolConfigOperation,
        tokens: [MVotingTokens.Power],
        governor: spog.contracts.emergencyGovernor,
        abi: emergencyGovernorABI,
        hasToPayFee: false,
        id: "emergencySetKey",
      },
    ],
  },

  {
    value: "reset",
    label: "Reset",
    isReset: true,
    submenuText:
      "The Reset proposals allows a yes threshold of ZERO holders to change the current governor of the system to a new version with a new POWER token.",
    id: "menuReset",
    children: [
      {
        value: "resetToPowerHolders",
        label: "Reset to Power holders",
        isReset: true,
        component: undefined,
        tokens: [MVotingTokens.Zero],
        governor: spog.contracts.zeroGovernor,
        abi: zeroGovernorABI,
        hasToPayFee: false,
        id: "resetToPowerHolders",
      },

      {
        value: "resetToZeroHolders",
        label: "Reset to Zero holders",
        isReset: true,
        component: undefined,
        tokens: [MVotingTokens.Zero],
        governor: spog.contracts.zeroGovernor,
        abi: zeroGovernorABI,
        hasToPayFee: false,
        id: "resetToZeroHolders",
      },
    ],
  },
];

const currentValue = computed(() => {
  if (
    selectedProposalType?.value?.value === "setEmergencyProposalThresholdRatio"
  ) {
    return `${basisPointsToPercentage(
      spog.getValues.emergencyProposalThresholdRatio!
    )}%`;
  }

  if (selectedProposalType?.value?.value === "setZeroProposalThresholdRatio") {
    return `${basisPointsToPercentage(
      spog.getValues.zeroProposalThresholdRatio!
    )}%`;
  }

  const formatFee = (value: string) => useFormatCash(value);

  if (
    ["setProposalFee", "setStandardProposalFee"].includes(
      selectedProposalType?.value?.value
    )
  ) {
    return formatFee(spog.getValues.proposalFee!);
  }
});

function onChangeProposalType(option) {
  console.log("onChangeProposalType", option);
  formData.proposalType = option.value;
  selectedProposalType.value = option;
  $validation.value.$reset();
  formData.proposalValue = null;
  formData.proposalValue2 = null;
  formData.proposalValue3 = null;
}

function buildDescriptionPayload() {
  const addHyperlink = (text, url) => (url ? `[${text}](${url})` : "");

  const descriptionPayload = [
    `# ${formData.title}`,
    formData.description,
    "\n\n---",
    addHyperlink("Discussion", formData.discussionURL),
    addHyperlink("IPFS", formData.ipfsURL),
  ].join("\n\n");

  return descriptionPayload;
}

async function onPreview() {
  await $validation.value.$validate();
  if (!$validation.value.$error) {
    previewDescription.value = buildDescriptionPayload();
    isPreview.value = true;
  }
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function writeAllowance() {
  const account = userAccount.value;
  // It needs approval to pay for fees
  const allowance = await readContract({
    abi: erc20ABI,
    address: spog.contracts.cashToken as Hash,
    functionName: "allowance",
    args: [account as Hash, selectedProposalType.value.governor as Hash], // address owner, address spender
    account,
  });
  console.log({ allowance });

  const fee = BigInt(spog.getValues.proposalFee!);
  if (allowance <= fee && hasToPayFee.value) {
    const { hash } = await writeContract({
      abi: erc20ABI,
      address: spog.contracts.cashToken as Hash,
      functionName: "approve",
      args: [selectedProposalType.value.governor as Hash, fee], // address spender, uint256 amount
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

async function writeProposal(calldatas, formData) {
  const account = userAccount.value;
  console.log({ selectedProposalType });
  const targets = [selectedProposalType.value.governor as Hash];

  const description = formData.description;
  const values = [0n]; // do not change

  const { hash } = await writeContract({
    abi: selectedProposalType.value.abi,
    address: selectedProposalType.value.governor as Hash,
    functionName: "propose",
    args: [targets, values, [calldatas], description],
    account,
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
  await forceSwitchChain();

  const catchErrorStep = (error) => {
    console.error({ error });
    stepper.value.changeCurrentStep("error");
    throw error;
  };

  try {
    steps = reactive([
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
    ]);

    modal.value.open();

    await writeAllowance().catch(catchErrorStep);

    stepper.value.nextStep();

    const formDataWithLinks = {
      ...formData,
      description: buildDescriptionPayload(),
    };

    const calldatas = buildCalldatas(formDataWithLinks);
    await writeProposal(calldatas, formDataWithLinks).catch(catchErrorStep);

    stepper.value.nextStep();
    stepper.value.changeCurrentStep("complete");

    await wait(1000);

    const isEmergency = selectedProposalType?.value?.isEmergency;
    if (isEmergency) {
      return navigateTo("/proposals/");
    }

    return navigateTo("/proposals/pending/");
  } catch (error) {
    console.error({ error });
    catchErrorStep(error);
  }
}

function stringToHexWith32Bytes(data) {
  return toHex(stringToBytes(data, { size: 32 }));
}

function buildCalldatas(formData) {
  const {
    proposalType: type,
    proposalValue: input1,
    proposalValue2: input2,
    proposalValue3: input3,
  } = formData;

  if (["addToList", "removeFromList"].includes(type)) {
    const encondeInputsListOperation = ({
      input1: list,
      input2: address,
    }: {
      input1: string;
      input2: string;
    }) => {
      return [stringToHexWith32Bytes(list), address];
    };

    return buildCalldatasSpog(
      type,
      encondeInputsListOperation({ input1, input2 })
    );
  }

  if (["removeFromAndAddToList"].includes(type)) {
    const encondeInputsListAddRemoveOperation = ({
      input1: list,
      input2: remove,
      input3: add,
    }: {
      input1: string;
      input2: string;
      input3: string;
    }) => {
      return [stringToHexWith32Bytes(list), remove, add];
    };

    return buildCalldatasSpog(
      type,
      encondeInputsListAddRemoveOperation({ input1, input2, input3 })
    );
  }

  if (["setKey"].includes(type)) {
    const key = input1;
    const value = ["penalty_rate", "mint_ratio"].includes(key)
      ? BigInt(percentageToBasispoints(input2))
      : input2;

    return buildCalldatasSpog(type, [
      stringToHexWith32Bytes(key),
      stringToHexWith32Bytes(value),
    ]);
  }

  if (["resetToPowerHolders", "resetToZeroHolders"].includes(type)) {
    // TODO? add checkers if inputs are  addresses that instances of smartcontracts ISPOG
    return buildCalldatasSpog(type, undefined);
  }

  if (["setProposalFee", "setStandardProposalFee"].includes(type)) {
    const valueEncoded = encodeAbiParameters(
      [{ type: "uint256" }],
      [useParseCash(input1)]
    );
    return buildCalldatasSpog(type, [valueEncoded]);
  }

  if (["setCashToken"].includes(type)) {
    const newFee = encodeAbiParameters(
      [{ type: "uint256" }],
      [useParseCash(input2)]
    );
    return buildCalldatasSpog(type, [input1, newFee]);
  }

  if (
    [
      "setEmergencyProposalThresholdRatio",
      "setZeroProposalThresholdRatio",
    ].includes(type)
  ) {
    const valueEncoded = encodeAbiParameters(
      [{ type: "uint256" }],
      [BigInt(percentageToBasispoints(input1))]
    );
    return buildCalldatasSpog(type, [valueEncoded]);
  }
}

function buildCalldatasSpog(functionName: any, args: any) {
  return encodeFunctionData({
    abi: selectedProposalType.value.abi,
    functionName,
    args,
  });
}

function onBack() {
  isPreview.value = false;
  previewDescription.value = null;
}
</script>

<style>
label {
  @apply text-grey-400 block mb-2 font-medium text-xs font-inter;
}
</style>

<style scoped>
h1 {
  @apply text-3xl font-light mb-12;
}

hr {
  border-top: 1px dashed #979797;
}

#info-text * {
  @apply my-4;
}

.error {
  @apply border border-red-500;
}

.create-steps {
  @apply flex items-center mb-6;
}

.create-steps .number {
  @apply text-green-700 text-xs tracking-[8px];
}

.disabled {
  /* selectedProposalType */
  pointer-events: none;
  opacity: 0.4;
}
</style>
