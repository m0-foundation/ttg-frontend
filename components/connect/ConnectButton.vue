<template>
  <div>
    <MModalWeb3Connect v-if="!isConnected" />
    <UButton v-else variant="soft" color="red" size="xs" @click="disconnect">
      Disconnect
    </UButton>
  </div>
</template>

<script setup lang="ts">
  import { useAccount, useDisconnect } from 'use-wagmi'

  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()
</script>
