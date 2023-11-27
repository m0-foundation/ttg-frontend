<template>
  <div>
    <div class="my-4">
      <!-- Power or Emergency -->
      <div v-if="version === 'Power'">
        <VoteProgressPower :votes="powerVotes" />
      </div>

      <div v-else-if="version === 'Emergency'">
        <VoteProgressPower
          :votes="powerVotes"
          :quorum="props.powerQuorum"
          :quorum-formatted="quorumFormattedPower"
        />
      </div>

      <!-- Zero -->
      <div v-else-if="version === 'Zero'">
        <VoteProgressZero
          :votes="zeroVotes"
          :quorum="props.zeroQuorum"
          :quorum-formatted="quorumFormattedZero"
        />
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
      yes: "0",
      no: "0",
    },
    zero: {
      yes: "0",
      no: "0",
    },
  }),
  version: "Power",
  zeroQuorum: undefined,
  powerQuorum: undefined,
  powerTotalSupply: () => 0n,
  zeroTotalSupply: () => 0n,
});

/* @output: range 0.00-100.00 */
const percentageSafeDiv = (a: bigint, b: bigint) =>
  Number((a * 10000n) / b) / 100;

function parseVotesForMajority({ yes, no }: { yes: string; no: string }) {
  const yesBI = BigInt(yes);
  const noBI = BigInt(no);

  const total = yesBI + noBI;

  const yesPercentage = total === 0n ? 0 : percentageSafeDiv(yesBI, total);
  const noPercentage = total === 0n ? 0 : percentageSafeDiv(noBI, total);

  return {
    total,
    yes: {
      count: yes,
      formatted: useNumberFormatter(yes),
      percentage: yesPercentage,
    },
    no: {
      count: no,
      formatted: useNumberFormatter(no),
      percentage: noPercentage,
    },
  };
}

function parseVotesForQuorom(
  {
    yes,
    no,
  }: {
    yes: string;
    no: string;
  },
  totalSupply: bigint
) {
  const yesBI = BigInt(yes);
  const noBI = BigInt(no);

  const total = totalSupply;

  const yesPercentage = total === 0n ? 0 : percentageSafeDiv(yesBI, total);
  const noPercentage = total === 0n ? 0 : percentageSafeDiv(noBI, total);

  return {
    total,
    yes: {
      count: yes,
      formatted: useNumberFormatter(yes),
      percentage: yesPercentage,
    },
    no: {
      count: no,
      formatted: useNumberFormatter(no),
      percentage: noPercentage, // range 0-100
    },
  };
}

const powerVotes = computed(() => {
  return props.version === "Power"
    ? parseVotesForMajority(props.tallies.power)
    : parseVotesForQuorom(props.tallies.power, props.powerTotalSupply!);
});

const zeroVotes = computed(() =>
  parseVotesForQuorom(props.tallies.zero, props.zeroTotalSupply!)
);

const quorumFormattedPower = computed(() =>
  useNumberFormatter(
    (props.powerTotalSupply * BigInt(props.powerQuorum! * 100)) / 100n
  )
);

const quorumFormattedZero = computed(() =>
  useNumberFormatter(
    (props.zeroTotalSupply * BigInt(props.zeroQuorum! * 100)) / 100n
  )
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
