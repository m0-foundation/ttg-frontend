<template>
  <div>
    <LayoutSubNavbar>
      <MNavButton>Active</MNavButton>
      <MNavButton>Scheduled</MNavButton>
      <MNavButton>Voting History</MNavButton>
    </LayoutSubNavbar>

    <LayoutBody>
      <p class="text-white">Balance: {{ data }}</p>
    </LayoutBody>
  </div>
</template>

<script lang="ts" setup>
import { readErc20Mock } from "~/lib/generated";

const data = await readErc20Mock({
  address: "0x8335Af67C928Ff9D4f9BE905de767cf252A83fe1",
  functionName: "balanceOf",
  args: ["0x31DCb7AE01fFfD9B6468814bA2A6A0ab9c58d8e5"],
});
</script>
