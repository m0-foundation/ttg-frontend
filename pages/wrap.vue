<template>
  <div>
    <PageTitle class="px-6 lg:p-0 mb-8">
      <template #default>Wrap/Unwrap</template>
    </PageTitle>

    <div class="px-6 lg:p-0 my-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="bg-grey-800 p-6">
          <div class="flex items-center gap-6">
            <img src="/img/tokens/m.svg" alt="M Token" class="w-10 h-10" />
            <div>
              <h2>M</h2>
              <p class="text-grey-500">
                Balance: {{ formatUnits(m.balance, 6) }}
              </p>
            </div>
          </div>
          <div class="flex items-center mt-6">
            <MInput v-model="m.input" class="h-10" />
            <MButton
              :is-loading="m.isWraping"
              :disable="m.isWraping"
              @click="wrapMToken"
            >
              Wrap
            </MButton>
          </div>
        </div>

        <div class="bg-grey-800 p-6">
          <div class="flex items-center gap-6">
            <img
              src="/img/tokens/m.svg"
              alt="M Token"
              class="w-10 h-10 rotate-180"
            />
            <div>
              <h2>Wrapped M</h2>
              <p class="text-grey-500">
                Balance: {{ formatUnits(wrappedM.balance, 6) }}
              </p>
            </div>
          </div>
          <div class="flex items-center mt-6">
            <MInput v-model="wrappedM.input" class="h-10" />
            <MButton
              :is-loading="wrappedM.isUnwraping"
              :disable="wrappedM.isUnwraping"
              @click="unwrapMToken"
            >
              Unwrap
            </MButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Hash, erc20Abi, formatUnits, parseUnits } from "viem";
import {
  readContract,
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { useAccount } from "use-wagmi";
import wrapperAbi from "@/assets/abis/wrapper.json";

useHead({
  titleTemplate: "%s - Wrap/Unwrap",
});

const alerts = useAlertsStore();
const wagmiConfig = useWagmiConfig();
const { address: userAccount } = useAccount();
const network = useNetworkStore().getNetwork();

const m = reactive({
  input: "",
  balance: 0n,
  isWraping: false,
});

const wrappedM = reactive({
  input: "",
  balance: 0n,
  isUnwraping: false,
});

const getBalances = async (token: Hash) => {
  try {
    return await readContract(wagmiConfig, {
      abi: erc20Abi,
      address: token as Hash,
      functionName: "balanceOf",
      args: [userAccount.value as Hash], // address token
    });
  } catch (error) {
    return 0n;
  }
};

const wrapMToken = async () => {
  if (!m.input) return;
  m.isWraping = true;
  try {
    await writeAllowance(m.input).catch(() => {
      alerts.errorAlert("Error getting approval!");
    });

    const tx = await writeContract(wagmiConfig, {
      abi: wrapperAbi,
      address: network.value.contracts.wrappedMToken as Hash,
      functionName: "wrap",
      args: [userAccount.value as Hash, parseUnits(m.input, 6)], // address token
    });

    const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
      confirmations: 1,
      hash: tx,
    });

    if (txReceipt.status !== "success") {
      throw new Error("Transaction was rejected");
    }

    alerts.successAlert("You successfully wrapped M");
  } catch (error) {
    alerts.errorAlert("Error", error.shortMessage);
  } finally {
    getTokensBalances();
    m.input = "";
    m.isWraping = false;
  }
};

const unwrapMToken = async () => {
  if (!wrappedM.input) return;
  wrappedM.isUnwraping = true;
  try {
    const tx = await writeContract(wagmiConfig, {
      abi: wrapperAbi,
      address: network.value.contracts.wrappedMToken as Hash,
      functionName: "unwrap",
      args: [userAccount.value as Hash, parseUnits(wrappedM.input, 6)], // address token
    });

    const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
      confirmations: 1,
      hash: tx,
    });

    if (txReceipt.status !== "success") {
      throw new Error("Transaction was rejected");
    }

    alerts.successAlert("You successfully unwrapped M");
  } catch (error) {
    alerts.errorAlert("Error", error.shortMessage);
  } finally {
    getTokensBalances();
    wrappedM.input = "";
    wrappedM.isUnwraping = false;
  }
};

async function writeAllowance(value: string) {
  const allowance = await readContract(wagmiConfig, {
    abi: erc20Abi,
    address: network.value.contracts.mToken as Hash,
    functionName: "allowance",
    args: [
      userAccount.value as Hash,
      network.value.contracts.wrappedMToken as Hash,
    ], // address owner, address spender
    account: userAccount.value as Hash,
  });

  if (!allowance || allowance < parseUnits(value, 6)) {
    const hash = await writeContract(wagmiConfig, {
      abi: erc20Abi,
      address: network.value.contracts.mToken as Hash,
      functionName: "approve",
      args: [
        network.value.contracts.wrappedMToken as Hash,
        parseUnits(value, 6),
      ], // address spender, uint256 amount
      account: userAccount.value as Hash,
    });

    const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
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

const getTokensBalances = async () => {
  m.balance = await getBalances(network.value.contracts.mToken as Hash);
  wrappedM.balance = await getBalances(
    network.value.contracts.wrappedMToken as Hash,
  );
};

onMounted(async () => {
  await getTokensBalances();
});
</script>
