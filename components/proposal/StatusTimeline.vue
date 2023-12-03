<template>
  <div class="flex justify-between">
    <div
      class="inline-flex uppercase text-grey-400 text-xs gap-1 lg:gap-2 items-center"
    >
      <div class="text-grey-primary hidden lg:block">status:</div>

      <MDropdown v-if="!proposal?.isEmergency">
        <template #activator>
          <ProposalStatusBadge
            :version="version"
            name="Pending"
            :show-arrow="true"
          />
        </template>
        <template #content>
          <ProposalStatusMenu :proposal="proposal" />
        </template>
      </MDropdown>

      <MDropdown>
        <template #activator>
          <ProposalStatusBadge
            :version="version"
            name="Active"
            :show-arrow="true"
          />
        </template>
        <template #content>
          <ProposalStatusMenu :proposal="proposal" />
        </template>
      </MDropdown>

      <MDropdown v-if="version === 'Defeated'">
        <template #activator>
          <ProposalStatusBadge
            :version="version"
            name="Defeated"
            :show-arrow="true"
          />
        </template>
        <template #content>
          <ProposalStatusMenu :proposal="proposal" />
        </template>
      </MDropdown>

      <MDropdown v-else>
        <template #activator>
          <ProposalStatusBadge
            :version="version"
            name="Succeeded"
            :show-arrow="true"
          />
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

      <MDropdown v-if="version === 'Executed'">
        <template #activator>
          <ProposalStatusBadge
            :version="version"
            name="Executed"
            :show-arrow="true"
          />
        </template>
        <template #content>
          <ProposalStatusMenu :proposal="proposal" />
        </template>
      </MDropdown>
      <ProposalStatusBadge v-else :version="version" name="Executed" />
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
