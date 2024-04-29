<template>
  <div>
    <PageTitle class="px-6 lg:p-0 mb-8">
      <template #default>Rewards</template>
      <template #subtitle>
        <p class="text-grey-500 font-inter">
          In exchange for ZERO holders' participation in protocol governance,
          they will receive the remainder of the protocol fees.
          <a
            href="https://docs.m0.org/m-0-documentation-portal/overview/whitepaper/iii.-governance/iii.ii-operation/iii.ii.viii-zero-claiming-of-residual-value"
            target="_blank"
            rel="noopener noreferrer"
            class="underline"
            >Learn more</a
          >.
        </p>
      </template>
    </PageTitle>

    <div class="px-6 lg:p-0 my-8">
      <h3 class="text-sm font-inter text-grey-200 mb-3">
        Total amount to be distributed among all holders
      </h3>
      <div class="flex flex-wrap gap-4 lg:gap-8">
        <MIconLoading v-if="loadingData" />
        <div v-for="token in cashTokens" v-else :key="token.address">
          <span class="token-label">{{ token.name }}</span>
          <MTokenAmount
            :amount="formatUnits(token.distributable, token.decimals)"
            :image="`/img/tokens/${token.symbol.toLowerCase()}.svg`"
            :name="token.name"
            size="20"
          />
        </div>
      </div>
    </div>

    <div class="px-6 lg:p-0 my-12">
      <h3 class="text-sm font-inter text-grey-200 mb-3">
        Claimable as ZERO holder
      </h3>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MIconLoading v-if="loadingData" />
        <div
          v-for="(token, i) in cashTokens"
          v-else
          :key="token.address"
          class="bg-grey-800 p-6"
        >
          <div class="flex justify-between items-end">
            <div>
              <h4 class="mb-3">{{ token.name }}</h4>
              <span class="token-label">Claimable balance</span>
              <MTokenAmount
                :amount="token.claimable"
                :image="`/img/tokens/${token.symbol.toLowerCase()}.svg`"
                :name="token.name"
                size="30"
              />
            </div>
            <MButton
              :disabled="token.claimable === 0n || token.isClaiming"
              :is-loading="token.isClaiming"
              @click="claimTokenRewards(token, i)"
              >Claim</MButton
            >
          </div>
        </div>
      </div>

      <p class="token-label my-3">
        Residual balance will be claimed to the connected address.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Hash, erc20Abi, formatUnits } from "viem";
import {
  readContract,
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { useAccount } from "use-wagmi";
import { distributionVaultAbi } from "@/lib/sdk";
import MIconLoading from "@/components/design-system/MIconLoading.vue";

useHead({
  titleTemplate: "%s - Rewards",
});

const cashTokens = ref([]);
const loadingData = ref(false);

const { epoch } = storeToRefs(useSpogStore());
const { address: userAccount } = useAccount();

const wagmiConfig = useWagmiConfig();
const spog = useSpogStore();
const alerts = useAlertsStore();

const allowedCashTokens = computed(() => spog.governors.zero.allowedCashTokens);

const claimEpochStart = computed(() =>
  BigInt(epoch.value.current.asNumber - 50)
);
const claimEpochEnd = computed(() => BigInt(epoch.value.current.asNumber - 1));

onMounted(async () => {
  loadingData.value = true;
  try {
    cashTokens.value = await Promise.all(
      allowedCashTokens.value.map(async (token) => {
        return {
          ...token,
          claimable: await getClaimableRewards(token),
          distributable: await getDistributableRewards(token),
          isClaiming: false,
        };
      })
    );
    console.log(cashTokens.value);
  } finally {
    loadingData.value = false;
  }
});

const getClaimableRewards = async (token) => {
  try {
    return await readContract(wagmiConfig, {
      abi: distributionVaultAbi,
      address: spog.contracts.vault as Hash,
      functionName: "getClaimable",
      args: [
        token.address as Hash,
        userAccount.value as Hash,
        claimEpochStart.value,
        claimEpochEnd.value,
      ], // address token, address account, uint256 startEpoch, uint256 endEpoch
    });
  } catch (error) {
    console.log("ERROR GETTING CLAIMABLE", error);
    return 0n;
  }
};

const getDistributableRewards = async (token) => {
  try {
    return await readContract(wagmiConfig, {
      abi: distributionVaultAbi,
      address: spog.contracts.vault as Hash,
      functionName: "getDistributable",
      args: [token.address as Hash], // address token
    });
  } catch (error) {
    console.log("ERROR GETTING CLAIMABLE", error);
    return 0n;
  }
};

const claimTokenRewards = async (token, index) => {
  cashTokens.value[index].isClaiming = true;

  try {
    const hash = await writeContract(wagmiConfig, {
      abi: distributionVaultAbi,
      address: spog.contracts.vault as Hash,
      functionName: "claim",
      args: [
        token.address as Hash,
        claimEpochStart.value,
        claimEpochEnd.value,
        userAccount.value as Hash,
      ],
    }); // address token, uint256 startEpoch, uint256 endEpoch, address destination

    const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
      confirmations: 1,
      hash,
    });

    if (txReceipt.status !== "success") {
      throw new Error("Transaction was rejected");
    } else {
      alerts.successAlert(`You claimed your ${token.name} rewards!`);
    }
  } finally {
    cashTokens.value[index].isClaiming = false;
  }
};
</script>

<style>
.token-label {
  @apply text-grey-500 text-xxs font-inter mb-1;
}
</style>
