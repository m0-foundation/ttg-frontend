<template>
  <div>
    <PageTitle class="mb-8 px-6 lg:p-0">
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
            >Learn more </a
          >.
        </p>
      </template>
    </PageTitle>

    <div class="px-6 lg:p-0">
      <h3 class="text-sm font-inter text-grey-200 mb-3">Total amount</h3>
      <div class="flex gap-8">
        <div>
          <span class="token-label">M Token</span>
          <MTokenAmount
            :amount="totalClaimableM"
            image="/img/tokens/m.svg"
            name="M"
            size="20"
          />
        </div>
        <div>
          <span class="token-label">WETH Token</span>
          <MTokenAmount
            :amount="totalClaimableWeth"
            image="/img/tokens/weth10.png"
            name="WETH"
            size="20"
          />
        </div>
      </div>
    </div>

    <div class="mt-8 px-6 lg:p-0">
      <h3 class="text-sm font-inter text-grey-200 mb-3">
        Claimable as ZERO holder
      </h3>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="bg-grey-800 p-6">
          <div class="flex justify-between items-end">
            <div>
              <h4 class="mb-3">M Token</h4>
              <span class="token-label">Claimable balance</span>
              <MTokenAmount
                :amount="userClaimableM"
                image="/img/tokens/m.svg"
                name="M"
                size="30"
              />
            </div>
            <MButton :disabled="!userClaimableM">Claim</MButton>
          </div>
        </div>
        <div class="bg-grey-800 p-6">
          <div class="flex justify-between items-end">
            <div>
              <h4 class="mb-3">WETH Token</h4>
              <span class="token-label">Claimable balance</span>
              <MTokenAmount
                :amount="userClaimableWeth"
                image="/img/tokens/weth10.png"
                name="WETH"
                size="30"
              />
            </div>
            <MButton :disabled="!userClaimableWeth">Claim</MButton>
          </div>
        </div>
      </div>

      <p class="token-label my-3">
        Residual balance will be claimed to the connected address.
      </p>
    </div>
  </div>
</template>

<script setup>
const userClaimableWeth = ref(0);
const userClaimableM = ref(0);

const totalClaimableWeth = ref(0);
const totalClaimableM = ref(0);
</script>

<style>
.token-label {
  @apply text-grey-500 text-xxs font-inter mb-1;
}
</style>
