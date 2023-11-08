<template>
  <div class="flex justify-between">
    <div
      class="inline-flex uppercase text-grey-400 text-xs gap-1 lg:gap-2 items-center"
    >
      <div class="text-grey-primary hidden lg:block">status:</div>

      <MDropdown>
        <template #activator>
          <ProposalStatusBadge :version="version" name="Pending" />
        </template>
        <template #content>
          <ProposalStatusMenu :proposal="proposal" />
        </template>
      </MDropdown>

      <MDropdown>
        <template #activator>
          <ProposalStatusBadge :version="version" name="Active" />
        </template>
        <template #content>
          <ProposalStatusMenu :proposal="proposal" />
        </template>
      </MDropdown>

      <MDropdown v-if="version === 'Defeated'">
        <template #activator>
          <ProposalStatusBadge :version="version" name="Defeated" />
        </template>
        <template #content>
          <ProposalStatusMenu :proposal="proposal" />
        </template>
      </MDropdown>

      <MDropdown v-else>
        <template #activator>
          <ProposalStatusBadge :version="version" name="Succeeded" />
        </template>
        <template #content>
          <ProposalStatusMenu :proposal="proposal" />
        </template>
      </MDropdown>

      <MDropdown v-if="version === 'Expired'">
        <template #activator>
          <ProposalStatusBadge :version="version" name="Expired" />
        </template>
        <template #content>
          <ProposalStatusMenu :proposal="proposal" />
        </template>
      </MDropdown>

      <MDropdown v-else>
        <template #activator>
          <ProposalStatusBadge :version="version" name="Executed" />
        </template>
        <template #content>
          <ProposalStatusMenu :proposal="proposal" />
        </template>
      </MDropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MProposal } from "~/lib/api/types";

export interface Props {
  version: string;
  proposal: MProposal | undefined;
}

const props = defineProps<Props>();
</script>
