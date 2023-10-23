<template>
  <div>
    <MModal ref="modal" @on-closed="onCloseModal">
      <MTransactionsStepper
        ref="stepper"
        title="Submitting your proposal"
        :steps="steps"
      />
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

          <div :class="{ disabled: selectedProposalType === undefined }">
            <div v-show="formData.proposalType" class="mb-6">
              <div class="gap-4 flex my-4">
                <div v-for="token in selectedProposalType?.tokens" :key="token">
                  <div
                    v-if="token === MVotingTokens.Power"
                    class="p-4 bg-primary-darker"
                  >
                    <div class="flex items-center gap-2 mb-2">
                      <p class="uppercase text-xs">Vote type</p>
                      <MIconPower class="w-6 h-6" />
                    </div>
                    Only holders who possess active
                    <u>{{ MVotingTokens.Power }} tokens</u> will be eligible to
                    participate in voting for or against the selected proposal
                    type.
                  </div>

                  <div
                    v-if="token === MVotingTokens.Zero"
                    class="p-4 bg-primary-darker"
                  >
                    <div class="flex items-center gap-2 mb-2">
                      <p class="uppercase text-xs">Vote type</p>
                      <MIconZero class="w-6 h-6" />
                    </div>
                    Only holders who possess active
                    <u>{{ MVotingTokens.Zero }} tokens</u> will be eligible to
                    participate in voting for or against the selected proposal
                    type.
                  </div>
                </div>
              </div>

              <label for="type-value">{{ selectedProposalType?.label }}</label>

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
              />
            </div>

            <div class="mb-6">
              <div class="flex justify-between mb-2">
                <label for="description">Description*</label>
                <div class="text-sm text-gray-400 flex">
                  <img src="/img/icon-markdown.svg" class="h-6 mx-2" />
                  Markdown supported
                </div>
              </div>

              <MTextareaMarkdown
                v-model="formData.description"
                name="description"
                :errors="$validation.description.$errors"
                class="h-80"
              />
            </div>

            <div class="mb-6">
              <label for="type-value">IPFS</label>

              <input
                v-model="formData.ipfsURL"
                type="text"
                placeholder="https://"
              />
            </div>

            <div class="mb-6">
              <label for="type-value">Discussion URL:</label>

              <input
                v-model="formData.discussionURL"
                type="text"
                placeholder="https://"
              />
            </div>
          </div>
        </div>

        <div v-else>
          <ProposalPreview
            :description="previewDescription"
            @on-back="onBack"
          />
        </div>
      </div>

      <div class="flex justify-end">
        <div class="flex items-center gap-2 text-lg">
          Proposal fee:
          <MIconWeth />
          {{ spogValues.setProposalFee }}
        </div>
      </div>
      <p class="text-grey-primary text-xs flex justify-end">
        You will be prompted to pay the tax for submitting the proposal.
      </p>

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
import { required, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { storeToRefs } from "pinia";
import { dualGovernorABI, writeDualGovernor } from "@/lib/sdk";
import ProposalInputSingleNumber from "@/components/proposal/InputSingleNumber.vue";
import ProposalInputRangeNumber from "@/components/proposal/InputRangeNumber.vue";
import ProposalInputListOperation from "@/components/proposal/InputListOperation.vue";
import ProposalInputSingleText from "@/components/proposal/InputSingleText.vue";
import ProposalInputUpdateConfig from "@/components/proposal/InputUpdateConfig.vue";
import { MProposalVotingTokens, MVotingTokens } from "@/lib/api";
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
  ipfsURL: null,
  discussionURL: null,
});

const rules = computed(() => {
  // all besides reset
  const isProposalValueRequired = !["reset"].includes(
    selectedProposalType?.value?.value
  );

  const isProposalValue2Required = [
    "addToList",
    "removeFromList",
    "updateConfig",
    "setProposalFeeRange",
  ].includes(selectedProposalType?.value?.value);

  const isProposalValue3Required = ["setProposalFeeRange"].includes(
    selectedProposalType?.value?.value
  );

  return {
    proposalValue: isProposalValueRequired ? { required } : {},
    proposalValue2: isProposalValue2Required ? { required } : {},
    proposalValue3: isProposalValue3Required ? { required } : {},
    description: { required, minLength: minLength(6) },
  };
});

const $validation = useVuelidate(rules, formData);

const previewDescription = ref();

const { address: userAccount } = useAccount();
const spog = useSpogStore();
const { getValues: spogValues } = storeToRefs(spog);

const proposalTypes = [
  {
    header: "protocol",
  },
  {
    value: "addToList",
    label: "Add to a list",
    component: ProposalInputListOperation,
    tokens: MProposalVotingTokens.addToList,
  },
  {
    value: "removeFromList",
    label: "Remove from a list",
    component: ProposalInputListOperation,
    tokens: MProposalVotingTokens.removeFromList,
  },

  {
    value: "updateConfig",
    label: "Update config",
    component: ProposalInputUpdateConfig,
    tokens: MProposalVotingTokens.updateConfig,
  },

  {
    header: "governance",
  },

  {
    value: "Quorums",
    label: "Quorums",
    children: [
      {
        value: "setPowerTokenQuorumRatio",
        label: "Power quorum",
        component: ProposalInputSingleNumber,
        modelValue: formData.proposalValue,
        tokens: MProposalVotingTokens.setPowerTokenQuorumRatio,
      },
      {
        value: "setZeroTokenQuorumRatio",
        label: "Zero quorum",
        component: ProposalInputSingleNumber,
        tokens: MProposalVotingTokens.setZeroTokenQuorumRatio,
      },
    ],
  },
  {
    value: "fee",
    label: "Fee",
    children: [
      {
        value: "setProposalFee",
        label: "Change fee",
        component: ProposalInputSingleNumber,
        tokens: MProposalVotingTokens.setProposalFee,
      },
      {
        value: "setProposalFeeRange",
        label: "Change fee range",
        component: ProposalInputRangeNumber,
        tokens: MProposalVotingTokens.setProposalFeeRange,
      },
    ],
  },

  {
    value: "reset",
    label: "Reset",
    placeholder: "Governance address",
    component: undefined,
    tokens: MProposalVotingTokens.reset,
  },

  {
    value: "emergency",
    label: "Emergency",
    isEmergency: true,
    children: [
      {
        value: "emergencyAddToList",
        label: "Emergency Add to a list",
        isEmergency: true,
        component: ProposalInputListOperation,
        tokens: MProposalVotingTokens.emergencyAddToList,
      },
      {
        value: "emergencyRemoveFromList",
        label: "Emergency Remove from a list",
        isEmergency: true,
        component: ProposalInputListOperation,
        tokens: MProposalVotingTokens.emergencyRemoveFromList,
      },
      {
        value: "emergencyUpdateConfig",
        label: "Emergency Update config",
        isEmergency: true,
        component: ProposalInputUpdateConfig,
        tokens: MProposalVotingTokens.emergencyUpdateConfig,
      },
    ],
  },
];

function onChangeProposalType(option) {
  console.log("onChangeProposalType", { option });
  formData.proposalType = option.value;
  selectedProposalType.value = option;
  $validation.value.$reset();
}

function addHyperlinksToDescription() {
  const addHyperlink = (text, url) => (url ? `[${text}](${url})` : "");

  const descriptionWithLinks =
    formData.description +
    [
      "\n\n---",
      addHyperlink("Discussion", formData.discussionURL),
      addHyperlink("IPFS", formData.ipfsURL),
    ].join("\n\n");

  return descriptionWithLinks;
}

function onPreview() {
  $validation.value.$validate();
  if (!$validation.value.$error) {
    previewDescription.value = addHyperlinksToDescription();
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
    args: [account as Hash, spog.contracts.governor as Hash], // address owner, address spender
    account,
  });
  console.log({ allowance });

  const fee = BigInt(spog.values.proposalFee || 0n);
  if (allowance <= fee) {
    const { hash } = await writeContract({
      abi: erc20ABI,
      address: spog.contracts.cashToken as Hash,
      functionName: "approve",
      args: [spog.contracts.governor as Hash, fee], // address spender, uint256 amount
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
  const targets = [spog.contracts.governor as Hash];

  const description = formData.description;
  const values = [0n]; // do not change

  const { hash } = await writeDualGovernor({
    address: spog.contracts.governor as Hash,
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
      description: addHyperlinksToDescription(),
    };

    const calldatas = buildCalldatas(formDataWithLinks);
    await writeProposal(calldatas, formDataWithLinks).catch(catchErrorStep);

    stepper.value.nextStep();
    stepper.value.changeCurrentStep("complete");

    await wait(1000);

    return navigateTo("/proposals/active/");
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

  if (
    [
      "addToList",
      "removeFromList",
      "emergencyAddToList",
      "emergencyRemoveFromList",
    ].includes(type)
  ) {
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

  if (["updateConfig", "emergencyUpdateConfig"].includes(type)) {
    const encondeInputsUpdateConfig = ({
      input1: key,
      input2: value,
    }: {
      input1: string;
      input2: any;
    }) => {
      return [stringToHexWith32Bytes(key), stringToHexWith32Bytes(value)];
    };

    return buildCalldatasSpog(
      type,
      encondeInputsUpdateConfig({ input1, input2 })
    );
  }

  if (["reset"].includes(type)) {
    // TODO? add checkers if inputs are  addresses that instances of smartcontracts ISPOG
    return buildCalldatasSpog(type, undefined);
  }

  if (["setProposalFee"].includes(type)) {
    const valueEncoded = encodeAbiParameters(
      [{ type: "uint256" }],
      [BigInt(input1 * 1e18)] // tax is using 18 decimals precision
    );
    return buildCalldatasSpog(type, [valueEncoded]);
  }

  if (["setProposalFeeRange"].includes(type)) {
    // tax is using 18 decimals precision
    const encodeBigInt = (value: any) =>
      encodeAbiParameters([{ type: "uint256" }], [BigInt(value * 1e18)]);

    return buildCalldatasSpog(
      type,
      // min, max, newFee
      [encodeBigInt(input1), encodeBigInt(input2), encodeBigInt(input3)]
    );
  }

  if (["setPowerTokenQuorumRatio", "setZeroTokenQuorumRatio"].includes(type)) {
    const valueEncoded = encodeAbiParameters(
      [{ type: "uint256" }],
      [BigInt(input1)] // tax is using 18 decimals precision
    );
    return buildCalldatasSpog(type, [valueEncoded]);
  }
}

function buildCalldatasSpog(functionName: any, args: any) {
  return encodeFunctionData({ abi: dualGovernorABI, functionName, args });
}

function onBack() {
  isPreview.value = false;
  previewDescription.value = null;
}
</script>

<style scoped>
h1 {
  @apply text-3xl font-light mb-12;
}

label {
  @apply text-grey-primary block mb-2 text-sm font-medium;
}

hr {
  border-top: 1px dashed #979797;
}

#info-text * {
  @apply my-4;
}

.error {
  @apply border border-red;
}

.disabled {
  /* selectedProposalType */
  pointer-events: none;
  opacity: 0.4;
}
</style>
