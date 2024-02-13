<template>
  <div class="flex justify-between">
    <div class="inline-flex text-grey-600 gap-1 lg:gap-2 items-center">
      <div class="text-grey-primary hidden lg:block text-xs">Status:</div>

      <MDropdown>
        <template #activator>
          <ProposalStatusBadge
            :version="version"
            name="Pending"
            :show-arrow="true"
          />
        </template>
        <template #content>
          <ProposalStatusMenu
            :updated="proposal?.timestamp"
            :status-block="proposal?.blockNumber"
            :tx-hash="proposal?.transactionHash"
          />
        </template>
      </MDropdown>

      <ProposalStatusBadge :version="version" name="Active" />

      <ProposalStatusBadge
        v-if="version === 'Defeated'"
        :version="version"
        name="Defeated"
        class="defeated"
      />

      <ProposalStatusBadge v-else :version="version" name="Succeeded" />

      <ProposalStatusBadge
        v-if="version === 'Expired'"
        :version="version"
        name="Expired"
        class="expired"
      />

      <MDropdown v-else-if="version === 'Executed'">
        <template #activator>
          <ProposalStatusBadge
            :version="version"
            name="Executed"
            :show-arrow="true"
            data-test="executed-badge"
          />
        </template>
        <template #content>
          <ProposalStatusMenu
            :status-block="proposal?.executedEvent?.blockNumber"
            :tx-hash="proposal?.executedEvent?.transactionHash"
            :updated="proposal?.executedEvent?.timestamp"
          />
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
