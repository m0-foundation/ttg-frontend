<template>
  <div>
    <div class="my-4">
      <!-- Power or Emergency -->
      <div v-if="version === 'Power'">
        <VoteProgressPower :votes="powerVotes" />
      </div>

      <div v-else-if="version === 'Emergency'">
        <VoteProgressPower :votes="powerVotes" :quorum="props.powerQuorum" />
      </div>

      <!-- Zero -->
      <div v-else-if="version === 'Zero'">
        <VoteProgressZero :votes="zeroVotes" :quorum="props.zeroQuorum" />
      </div>

      <!-- Double -->
      <div v-else-if="version === 'Double'">
        <div class="mb-8">
          <VoteProgressPower :votes="powerVotes" :quorum="props.powerQuorum" />
        </div>

        <div>
          <VoteProgressZero :votes="zeroVotes" :quorum="props.zeroQuorum" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MProposalTallies, MVotingType } from "@/lib/api/types";

interface Props {
  votes: MProposalTallies;
  version: MVotingType;
  zeroQuorum?: number; // range of 0 -> 1 i.e: 0.5 = 50%, 1=100%
  powerQuorum?: number;
}
const props = withDefaults(defineProps<Props>(), {
  votes: {
    power: {
      yes: 0,
      no: 0,
      total: 0,
    },
    zero: {
      yes: 0,
      no: 0,
      total: 0,
    },
  },
  version: "Power",
  zeroQuorum: undefined,
  powerQuorum: undefined,
});

function parseVotes({
  yes,
  no,
  total,
}: {
  yes: number;
  no: number;
  total: number;
}) {
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
      formatted: useNumberFormatter(yes),
      ratio: yesRatio,
      percentage: yesPercentage,
    },
    no: {
      count: no,
      formatted: useNumberFormatter(no),
      ratio: noRatio,
      percentage: noPercentage,
    },
  };
}

const powerVotes = computed(() => parseVotes(props.votes.power));
const zeroVotes = computed(() => parseVotes(props.votes.zero));
</script>
<style scoped>
.text-yes {
  @apply text-green-900 text-xs mx-auto;
}

.text-no {
  @apply text-red-500 text-xs mx-auto;
}
</style>
