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
  tallies: MProposalTallies;
  version: MVotingType;
  zeroQuorum?: number; // range of 0 -> 1 i.e: 0.5 = 50%, 1=100%
  powerQuorum?: number;
  powerTotalSupply?: bigint;
  zeroTotalSupply?: bigint;
}
const props = withDefaults(defineProps<Props>(), {
  tallies: () => ({
    power: {
      yes: 0n,
      no: 0n,
    },
    zero: {
      yes: 0n,
      no: 0n,
    },
  }),
  version: "Power",
  zeroQuorum: undefined,
  powerQuorum: undefined,
  powerTotalSupply: () => 0n,
  zeroTotalSupply: () => 0n,
});

function parseVotesForMajority({ yes, no }: { yes: bigint; no: bigint }) {
  const yesN = Number(yes);
  const noN = Number(no);
  const total = yesN + noN;

  const yesRatio = total === 0 ? 0 : yesN / total;
  const noRatio = total === 0 ? 0 : noN / total;
  const yesPercentage = yesRatio * 100;
  const noPercentage = noRatio * 100;

  console.log("parseVotesForMajority", {
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

function parseVotesForQuorom(
  {
    yes,
    no,
  }: {
    yes: bigint;
    no: bigint;
  },
  totalSupply: bigint
) {
  const yesN = Number(yes);
  const noN = Number(no);
  const total = Number(totalSupply);

  const yesRatio = total === 0 ? 0 : yesN / total;
  const noRatio = total === 0 ? 0 : noN / total;
  const yesPercentage = yesRatio * 100;
  const noPercentage = noRatio * 100;

  console.log("parseVotesForQuorom", {
    yesN,
    noN,
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

const powerVotes = computed(() => {
  return props.version === "Power"
    ? parseVotesForMajority(props.tallies.power)
    : parseVotesForQuorom(props.tallies.power, props.powerTotalSupply);
});

const zeroVotes = computed(() =>
  parseVotesForQuorom(props.tallies.zero, props.zeroTotalSupply)
);
</script>
<style scoped>
.text-yes {
  @apply text-green-900 text-xs mx-auto;
}

.text-no {
  @apply text-red-500 text-xs mx-auto;
}
</style>
