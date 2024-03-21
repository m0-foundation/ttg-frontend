<template>
  <div>
    <div class="my-6">
      <!-- Power or Emergency -->
      <div v-if="version === 'Standard'">
        <VoteProgressPower :votes="powerVotes" />
      </div>

      <div v-else-if="version === 'Emergency'">
        <VoteProgressPower
          :votes="powerVotes"
          :threshold="props.powerThreshold!"
          :threshold-formatted="thresholdFormattedPower"
        />
      </div>

      <!-- Zero -->
      <div v-else-if="version === 'Zero'">
        <VoteProgressZero
          :votes="zeroVotes"
          :threshold="props.zeroThreshold!"
          :threshold-formatted="thresholdFormattedZero"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MVotingType } from "@/lib/api/types";
import { useNumberFormatterCompact } from "@/utils/numberFormatter";

interface Props {
  yesVotes: bigint;
  noVotes: bigint;
  version: MVotingType;
  zeroThreshold?: number; // range of 0 -> 1 i.e: 0.5 = 50%, 1=100%
  powerThreshold?: number;
  powerTotalSupply?: bigint;
  zeroTotalSupply?: bigint;
}
const props = withDefaults(defineProps<Props>(), {
  yesVotes: () => 0n,
  noVotes: () => 0n,
  version: "Standard",
  zeroThreshold: undefined,
  powerThreshold: undefined,
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
      count: yesBI,
      formatted: useNumberFormatterCompact(yes),
      percentage: yesPercentage,
    },
    no: {
      count: noBI,
      formatted: useNumberFormatterCompact(no),
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
  totalSupply: bigint,
) {
  const yesBI = BigInt(yes);
  const noBI = BigInt(no);

  const total = totalSupply;

  const yesPercentage = total === 0n ? 0 : percentageSafeDiv(yesBI, total);
  const noPercentage = total === 0n ? 0 : percentageSafeDiv(noBI, total);

  return {
    total,
    yes: {
      count: yesBI,
      formatted: useNumberFormatterCompact(yes),
      percentage: yesPercentage,
    },
    no: {
      count: noBI,
      formatted: useNumberFormatterCompact(no),
      percentage: noPercentage, // range 0-100
    },
  };
}

const powerVotes = computed(() => {
  return props.version === "Standard"
    ? parseVotesForMajority({
        yes: props.yesVotes.toString(),
        no: props.noVotes.toString(),
      })
    : parseVotesForQuorom(
        {
          yes: props.yesVotes.toString(),
          no: props.noVotes.toString(),
        },
        props.powerTotalSupply!,
      );
});

const zeroVotes = computed(() =>
  parseVotesForQuorom(
    {
      yes: props.yesVotes.toString(),
      no: props.noVotes.toString(),
    },
    props.zeroTotalSupply!,
  ),
);

const thresholdFormattedPower = computed(() =>
  useNumberFormatterCompact(
    (props.powerTotalSupply * BigInt(props.powerThreshold! * 100)) / 100n,
  ),
);

const thresholdFormattedZero = computed(() =>
  useNumberFormatterCompact(
    (props.zeroTotalSupply * BigInt(props.zeroThreshold! * 100)) / 100n,
  ),
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
