<template>
  <div>
    <div class="px-6 lg:p-0">
      <PageTitle class="mb-3">Delegate voting power</PageTitle>

      <p class="text-grey-600 text-sm lg:text-base mb-6">
        Both POWER and ZERO owners may delegate their voting power to an
        arbitrary Ethereum address during the Transfer Epoch. Delegated POWER
        will retain its inflation in the owner address, while ZERO rewards will
        be claimable by the delegate address.
      </p>
    </div>

    <div v-if="!canDelegate && !isConnected" class="bg-accent-blue p-6 mb-6">
      <span class="uppercase mb-2 text-xs">Warning</span>
      <div class="flex items-center gap-3">
        <MIconWarning class="w-12" />
        <p>You need to connect a wallet to delegate your voting power.</p>
      </div>
    </div>

    <form
      class="my-4 bg-grey-800 p-6 font-inter"
      @submit.prevent="delegatePower"
    >
      <div>
        <div class="flex justify-between items-center mb-3">
          <div>
            <p class="text-xl">POWER Tokens</p>
            <p class="text-grey-600 text-xs">
              You are delegating
              <span class="text-grey-500 font-bold">only voting power</span>.
              The tokens will remain in your balance.
            </p>
          </div>

          <div class="flex-col gap-2">
            <div class="flex gap-1 items-center">
              <MIconPower class="h-6 w-6" />
              <span class="flex items-center text-2xl">
                {{ powerVotingPower?.data.value?.relative?.toFixed(2) }}%
              </span>
            </div>
            <div>
              <span class="text-xxs text-gray-600 uppercase">Voting Power</span>
            </div>
          </div>
        </div>

        <div>
          <div v-if="!canDelegate" class="bg-accent-blue p-6 mb-6">
            <span class="uppercase mb-2 text-xs">Warning</span>
            <div class="flex items-center gap-3">
              <MIconWarning class="w-12" />
              <p>
                The transfer epoch has concluded. You will be able to delegate
                in the next Transfer epoch.
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-between">
          <label class="text-grey-600">Delegation address</label>
          <NuxtLink
            class="text-grey-600 underline text-xs cursor-pointer"
            @click="onUseMyAddressPower"
          >
            Use my address
          </NuxtLink>
        </div>
        <MInput
          id="input-delegate-power"
          v-model="powerFormData.address"
          type="text"
          class="w-full border border-gray-600 rounded p-4 mb-2"
          data-test="delegate-power-input-address"
          :errors="$delegatePowerValidation.address?.$errors"
        />

        <div
          v-if="hasDelegatedPower"
          class="px-2 py-1 w-fit text-xs text-white bg-accent-blue"
        >
          Voting power delegated to:
          <MAddressAvatar :address="powerDelegates" :short-address="false" />
        </div>
        <div
          v-if="!hasDelegatedPower && powerDelegates"
          class="px-2 py-1 w-fit text-xs bg-grey-600 text-white"
        >
          <p>Self-delegated</p>
        </div>
      </div>

      <div class="flex justify-end items-center gap-2 my-4">
        <MButton
          id="button-delegate-power"
          type="submit"
          data-test="delegate-button-power-submit"
          :disabled="!isConnected || !canDelegate || powerFormData.loading"
          :is-loading="powerFormData.loading"
        >
          delegate POWER
        </MButton>
      </div>
    </form>

    <form
      class="my-4 bg-grey-800 p-6 font-inter"
      @submit.prevent="delegateZero"
    >
      <div>
        <div class="flex justify-between items-center my-3">
          <div>
            <p class="text-xl">ZERO Tokens</p>
            <p class="text-grey-600 text-xs">
              You are delegating
              <span class="text-grey-500 font-bold">only voting power</span>.
              The tokens will remain in your balance.
            </p>
          </div>
          <div class="flex-col gap-2">
            <div class="flex gap-1 items-center">
              <MIconZero class="h-6 w-6" />
              <span class="mx-2 flex items-center text-2xl">
                {{ zeroVotingPower?.data.value?.relative?.toFixed(2) }}%
              </span>
            </div>
            <div>
              <span class="text-xxs text-gray-600 uppercase">Voting Power</span>
            </div>
          </div>
        </div>
        <div class="flex justify-between">
          <label class="text-grey-600">Delegation address</label>
          <NuxtLink
            class="text-grey-600 underline text-xs cursor-pointer"
            @click="onUseMyAddressZero"
          >
            Use my address
          </NuxtLink>
        </div>
        <MInput
          id="input-delegate-zero"
          v-model="zeroFormData.address"
          type="text"
          class="w-full border border-gray-600 rounded p-4 mb-2"
          data-test="delegate-zero-input-address"
          :errors="$delegateZeroValidation.address?.$errors"
        />

        <div
          v-if="hasDelegatedZero"
          class="px-2 py-1 w-fit text-xs text-white bg-accent-blue"
        >
          Voting power delegated to:
          <MAddressAvatar :address="zeroDelegates" :short-address="false" />
        </div>
        <div
          v-if="!hasDelegatedZero && zeroDelegates"
          class="px-2 py-1 w-fit text-xs bg-grey-600 text-white"
        >
          <p>Self-delegated</p>
        </div>
      </div>

      <div class="flex justify-end items-center gap-2 my-2">
        <MButton
          id="button-delegate-zero"
          type="submit"
          :disabled="!isConnected || zeroFormData.loading"
          data-test="delegate-button-zero-submit"
          :is-loading="zeroFormData.loading"
        >
          delegate ZERO
        </MButton>
      </div>
    </form>

    <p class="px-6 text-grey-600 text-xxs lg:text-sm font-mono text-end mt-6">
      /* The delegated tokens will be available for voting starting from the
      next epoch. */
    </p>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { Hash, isAddress } from "viem";
import { useAccount } from "use-wagmi";
import { helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useMDelegates, useMVotingPower } from "@/lib/hooks";
import { writePowerToken, writeZeroToken } from "@/lib/sdk";

const spog = storeToRefs(useSpogStore());
const alerts = useAlertsStore();

const { address: userAccount, isConnected } = useAccount();

const {
  powerDelegates,
  zeroDelegates,
  hasDelegatedPower,
  hasDelegatedZero,
  ...useDelegate
} = useMDelegates(userAccount);

console.log({ hasDelegatedPower });
const {
  power: powerVotingPower,
  zero: zeroVotingPower,
  ...useVotingPower
} = useMVotingPower(userAccount);

const onUseMyAddressPower = () => (powerFormData.address = userAccount.value!);
const onUseMyAddressZero = () => (zeroFormData.address = userAccount.value!);

const canDelegate = computed(
  () => spog.epoch.value.current.type === "TRANSFER"
);

const powerFormData = reactive({
  address: "",
  loading: false,
});

const zeroFormData = reactive({
  address: "",
  loading: false,
});

const addressValidation = (val: Hash) => isAddress(val);
const addressValidationDelegatePower = (val: Hash) =>
  val !== powerDelegates.value;
const addressValidationDelegateZero = (val: Hash) =>
  val !== zeroDelegates.value;

const addressValidationRule = {
  addressValidation: helpers.withMessage("Invalid address", addressValidation),
};

const delegatePowerValidationRule = {
  delegatePowerValidation: helpers.withMessage(
    "Please enter a different address than the one you've currently provided.",
    addressValidationDelegatePower
  ),
};

const delegateZeroValidationRule = {
  delegatePowerValidation: helpers.withMessage(
    "Please enter a different address than the one you've currently provided.",
    addressValidationDelegateZero
  ),
};

const powerRules = {
  address: {
    ...addressValidationRule,
    ...delegatePowerValidationRule,
  },
};

const zeroRules = {
  address: {
    ...addressValidationRule,
    ...delegateZeroValidationRule,
  },
};

const $delegatePowerValidation = useVuelidate(powerRules, powerFormData);
const $delegateZeroValidation = useVuelidate(zeroRules, zeroFormData);

const { forceSwitchChain } = useCorrectChain();
const wagmiConfig = useWagmiConfig();

useHead({
  titleTemplate: "%s - Delegate",
});

async function delegatePower() {
  await $delegatePowerValidation.value.$validate();
  if ($delegatePowerValidation.value.$error) return;
  powerFormData.loading = true;

  try {
    await forceSwitchChain();

    const hash = await writePowerToken(wagmiConfig, {
      address: spog.contracts.value.powerToken as Hash,
      functionName: "delegate",
      args: [powerFormData.address! as Hash],
    });

    const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
      confirmations: 1,
      hash,
    });

    if (txReceipt.status !== "success") {
      throw new Error("Transaction was rejected");
    }

    alerts.successAlert(
      "POWER tokens voting power were delegated Successfully!"
    );

    useDelegate.refetch();
    useVotingPower.refetch();
  } catch (error) {
    console.error(error);
    alerts.errorAlert("Error while delegating!");
  } finally {
    powerFormData.loading = false;
    powerFormData.address = "";
    $delegatePowerValidation.value.$reset();
  }
}

async function delegateZero() {
  await $delegateZeroValidation.value.$validate();
  if ($delegateZeroValidation.value.$error) return;
  zeroFormData.loading = true;

  try {
    await forceSwitchChain();

    const hash = await writeZeroToken(wagmiConfig, {
      address: spog.contracts.value.zeroToken as Hash,
      functionName: "delegate",
      args: [zeroFormData.address! as Hash],
    });

    const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
      confirmations: 1,
      hash,
    });

    if (txReceipt.status !== "success") {
      throw new Error("Transaction was rejected");
    }

    alerts.successAlert(
      "ZERO tokens voting power were delegated Successfully!"
    );
    useDelegate.refetch();
    useVotingPower.refetch();
  } catch (error) {
    console.error(error);
    alerts.errorAlert("Error while delegating!");
  } finally {
    zeroFormData.loading = false;
    zeroFormData.address = "";
    $delegateZeroValidation.value.$reset();
  }
}
</script>
