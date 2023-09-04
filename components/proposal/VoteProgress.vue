<template>
  <div>
    <div class="my-4">
      <div class="flex justify-between gap-2 items-center">
        <span id="vote-yes-percentage" class="text-primary-darker text-xs">
          {{ votes?.yes?.percentage.toFixed(1) }}%
        </span>

        <MProgressBar :width="votes?.yes?.percentage" />

        <span
          id="vote-no-percentage"
          class="text-red text-xs flex items-baseline"
        >
          {{ votes?.no?.percentage.toFixed(1) }}%
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProposalVotesState } from "~/lib/api";

interface Props {
  yes: bigint | number;
  no: bigint | number;
}
const props = withDefaults(defineProps<Props>(), {
  yes: 0,
  no: 0,
});

function parseProposalVotes(
  yes: bigint | number,
  no: bigint | number
): ProposalVotesState {
  yes = Number(yes);
  no = Number(no);

  const total = yes + no;

  const yesRatio = total === 0 ? 0 : yes / total;
  const noRatio = total === 0 ? 0 : no / total;
  const yesPercentage = yesRatio * 100;
  const noPercentage = noRatio * 100;

  console.log({
    yes,
    no,
    total,
    yesRatio,
    noRatio,
    yesPercentage,
    noPercentage,
  });
  return {
    total,
    yes: {
      count: yes,
      ratio: yesRatio,
      percentage: yesPercentage,
    },
    no: {
      count: no,
      ratio: noRatio,
      percentage: noPercentage,
    },
  };
}

const votes = computed(() => parseProposalVotes(props.yes, props.no));
</script>
