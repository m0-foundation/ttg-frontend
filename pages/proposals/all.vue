<template>
  <div>
    <PageTitle>
      <template #pretitle>
        <NuxtLink
          class="text-green-700 hover:text-green-600 text-sm uppercase cursor-pointer"
          @click="$router.back()"
          >Back</NuxtLink
        >
      </template>
      <template #default>All proposals</template>
      <template #side>
        <div class="flex gap-3 mt-2 lg:mt-0">
          <select
            v-model="selectedType"
            class="h-[32px] w-[170px] bg-transparent text-grey-100 text-xxs p-0 px-2"
          >
            <option value="all" default>All proposals</option>
            <option
              v-for="option in proposalTypes"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
          <select
            v-model="selectedEpoch"
            class="h-[32px] w-[170px] bg-transparent text-grey-100 text-xxs p-0 px-2"
          >
            <option :value="0" default>All epochs</option>
            <option
              v-for="option in epochNumbers"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>
      </template>
    </PageTitle>

    <LayoutPage class="bg-transparent">
      <div v-if="!filteredProposals || !filteredProposals.length">
        No proposals to show.
      </div>
      <MTable v-else :key="filteredProposals" :config="tableConfig" />
    </LayoutPage>
  </div>
</template>

<script setup lang="ts">
import { html } from "gridjs";
import ProposalStatus from "@/components/proposal/Status.vue";
import MIconPower from "@/components/design-system/MIconPower.vue";
import MIconZero from "@/components/design-system/MIconZero.vue";

const store = useProposalsStore();
const proposals = computed(() => store.data);

const selectedType = ref("all");
const selectedEpoch = ref(0);

const proposalTypes = computed(() => [
  ...new Set(proposals.value.map((obj) => obj.proposalLabel)),
]);

const epochNumbers = computed(() => [
  ...new Set(proposals.value.map((obj) => obj.epoch)),
]);

const filteredProposals = computed(() => {
  let results = proposals.value;

  if (selectedType.value !== "all")
    results = results.filter((obj) => obj.proposalLabel === selectedType.value);

  if (selectedEpoch.value !== 0)
    results = results.filter((obj) => obj.epoch === selectedEpoch.value);

  return results;
});

useHead({
  titleTemplate: "%s - All proposals",
});

const tableConfig = computed(() => {
  return {
    columns: [
      {
        id: "proposalId",
        hidden: true,
      },
      {
        id: "epoch",
        name: "Epoch",
        sort: true,
        width: "100px",
        formatter: (cell: string) =>
          html(
            `<span class="text-sm text-grey-100 whitespace-nowrap">#${cell}</span>`
          ),
      },

      {
        id: "votingType",
        name: "Token",
        sort: false,
        width: "90px",
        formatter: (cell: string, row: any) => {
          const PowerIcon = useComponentToHtml(MIconPower, {
            class: "h-5 w-5 ml-1",
          }).html;
          const ZeroIcon = useComponentToHtml(MIconZero, {
            class: "h-5 w-5 ml-1",
          }).html;

          if (["Standard", "Emergency"].includes(cell)) {
            return html(PowerIcon);
          }

          if (["Zero"].includes(cell)) {
            return html(ZeroIcon);
          }
        },
      },
      {
        id: "proposal",
        name: "Proposal",
        sort: true,
        formatter: (cell: string, row: any) => {
          const { toFormat } = useDate(Number(row.cells[5].data));
          const { title } = useParsedDescriptionTitle(cell);
          return html(
            `<a href="/proposal/${
              row.cells[0].data
            }/" class="underline text-nowrap">${title}</a>
          <p class="text-xs text-grey-400 mt-1">${
            row.cells[4].data
          } · Created: ${toFormat("DD.MM.YY")}</p>
          `
          );
        },
      },

      {
        id: "action",
        name: "Action",
        sort: true,
        hidden: true,
        formatter: (cell: string) =>
          html(
            `<span class="text-xs text-grey-400 whitespace-nowrap">${cell}</span>`
          ),
      },

      {
        id: "created",
        name: "Created",
        sort: true,
        hidden: true,
        formatter: (cell: string) => {
          const { toFormat } = useDate(Number(cell));
          const formatedDate = toFormat("LLL");
          return html(
            `<span class="text-xs text-grey-400">${formatedDate}</span>`
          );
        },
      },
      {
        id: "status",
        name: "Status",
        sort: true,
        formatter: (cell: string) =>
          html(useComponentToHtml(ProposalStatus, { version: cell }).html),
      },
    ],
    data: filteredProposals.value.map((p) => ({
      proposalId: p.proposalId,
      epoch: p.epoch,
      proposal: p.description,
      action: p.proposalLabel,
      votingType: p.votingType,
      status: p.state,
      created: p.timestamp,
    })),
  };
});
</script>
