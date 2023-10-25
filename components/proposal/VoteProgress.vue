<template>
  <div>
    <div class="my-4">
      <!-- Power -->
      <div
        v-if="version === 'Power'"
        class="flex justify-between gap-2 items-center"
      >
        <div class="flex items-end w-[9rem]">
          <MIconPower class="h-4 w-4 mr-1" />
          <span class="flex uppercase text-xxs text-grey-primary">
            power tokens
          </span>
        </div>

        <span id="vote-yes-percentage" class="text-primary-darker text-xs">
          {{ powerVotes?.yes?.percentage.toFixed(1) }}%
        </span>

        <MProgressBar version="majority" :width="powerVotes?.yes?.percentage" />

        <span
          id="vote-no-percentage"
          class="text-red text-xs flex items-baseline"
        >
          {{ powerVotes?.no?.percentage.toFixed(1) }}%
        </span>
      </div>
      <!-- Zero -->
      <div
        v-else-if="version === 'Zero'"
        class="flex justify-between gap-2 items-center"
      >
        <div class="flex items-end w-[9rem]">
          <MIconZero class="h-4 w-4 mr-1" version="dark" />
          <span class="flex uppercase text-xxs text-grey-primary">
            zero tokens
          </span>
        </div>

        <span id="vote-yes-percentage" class="text-primary-darker text-xs">
          {{ zeroVotes?.yes?.percentage.toFixed(1) }}%
        </span>

        <MProgressBar
          version="quorum"
          :quorum="props.zeroQuorum"
          :width="zeroVotes?.yes?.percentage"
        />

        <span
          id="vote-no-percentage"
          class="text-red text-xs flex items-baseline"
        >
          {{ zeroVotes?.no?.percentage.toFixed(1) }}%
        </span>
      </div>

      <!-- Double -->
      <div v-else-if="version === 'Double'">
        <div class="flex items-center mb-4">
          <div class="flex items-end w-[9rem]">
            <MIconPower class="h-4 w-4 mr-1" />
            <span class="flex uppercase text-xxs text-grey-primary">
              power tokens
            </span>
          </div>

          <div id="power-votes-yes-percentage" class="flex w-1/12">
            <span class="text-yes">
              {{ powerVotes?.yes?.percentage.toFixed(0) }}%
            </span>
          </div>

          <MProgressBar
            version="quorum"
            :width="powerVotes?.yes?.percentage"
            :quorum="props.powerQuorum"
            class="w-10/12"
          />

          <div id="power-votes-no-percentage" class="flex w-1/12">
            <span class="text-no">
              {{ powerVotes?.no?.percentage.toFixed(0) }}%
            </span>
          </div>
        </div>

        <div class="flex items-center">
          <div class="flex items-end w-[9rem]">
            <MIconZero class="h-4 w-4 mr-1" version="dark" />
            <span class="flex uppercase text-xxs text-grey-primary">
              zero tokens
            </span>
          </div>

          <div id="zero-votes-yes-percentage" class="flex w-1/12">
            <span class="text-yes">
              {{ zeroVotes?.yes?.percentage.toFixed(0) }}%
            </span>
          </div>

          <MProgressBar
            version="quorum"
            :quorum="props.zeroQuorum"
            :width="zeroVotes?.yes?.percentage"
            class="w-10/12"
          />

          <div id="zero-votes-no-percentage" class="flex w-1/12">
            <span class="text-no">
              {{ zeroVotes?.no?.percentage.toFixed(0) }}%
            </span>
          </div>
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
      yes: 10,
      no: 0,
      total: 10,
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

const powerVotes = computed(() => parseVotes(props.votes.power));
const zeroVotes = computed(() => parseVotes(props.votes.zero));
</script>
<style scoped>
.text-yes {
  @apply text-primary-darker text-xs mx-auto;
}

.text-no {
  @apply text-red text-xs mx-auto;
}
</style>
