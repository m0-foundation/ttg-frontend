<template>
  <LayoutPage>
    <div class="p-4 bg-white">
      <div class="w-full inline-flex items-center mb-2 px-2 justify-end">
        <button
          type="button"
          data-drawer-hide="drawer-example"
          aria-controls="drawer-example"
          class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-12 h-12 inline-flex items-center justify-center"
          @click="close"
        >
          <svg
            class="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span class="sr-only">Close menu</span>
        </button>
      </div>
      <ProposalDetails :proposal-id="proposalId" />
    </div>
  </LayoutPage>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const proposalId = route.params.proposal_id as string;

useHead({
  titleTemplate: `%s - Proposal #${proposalId}`,
});

function close() {
  router.push({ path: "/proposals/all" });
}
</script>
