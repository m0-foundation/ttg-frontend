<template>
  <UContainer class="pb-4">
    <div class="flex justify-center items-center min-h-dvh">
      <UCard class="w-full max-w-sm">
        <UFormGroup
          label="Enter password to access this app"
          name="app-password"
          :error="error">
          <MInput
            id="app-password"
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full"
            @keyup.enter="onSubmit" />
        </UFormGroup>
        <UButton
          label="Submit"
          size="lg"
          color="primary"
          class="w-full mt-4"
          @click="onSubmit" />
      </UCard>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
  const { submit } = useAppPassword()

  const password = ref('')
  const error = ref('')

  function onSubmit() {
    error.value = submit(password.value) ? '' : 'Incorrect password'
  }
</script>
