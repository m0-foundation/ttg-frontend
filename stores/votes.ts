import uniqBy from "lodash/uniqBy";
import { MVote } from "@/lib/api/types";
import { defineStore } from "pinia";

export const useVotesStore = defineStore("votes", () => {
  const api = useApiClientStore();

  const votes = ref<Array<MVote>>([]);

  function getBy(key: keyof MVote, value: string) {
    return computed(() => votes.value.filter((v) => v[key] === value));
  }

  function add(newVotes: MVote[]) {
    votes.value = [...uniqBy([...votes.value, ...newVotes], "voteId")];
  }

  async function fetchVotesStandard() {
    console.log("fetchVotesStandard");
    const votes = await api.client.standardGovernor!.voting!.getAllVotes();
    add(votes);
  }

  async function fetchVotesEmergency() {
    console.log("fetchVotesEmergency");
    const votes = await api.client.emergencyGovernor!.voting!.getAllVotes();
    add(votes);
  }

  async function fetchVotesZero() {
    console.log("fetchVotesZero");
    const votes = await api.client.zeroGovernor!.voting!.getAllVotes();
    add(votes);
  }

  async function fetchAllVotes() {
    await Promise.all([
      fetchVotesStandard(),
      fetchVotesEmergency(),
      fetchVotesZero(),
    ]);
  }

  async function fetchVotes(votingType: "Standard" | "Emergency" | "Zero") {
    return votingType === "Standard"
      ? await fetchVotesStandard()
      : votingType === "Emergency"
        ? await fetchVotesEmergency()
        : await fetchVotesZero();
  }

  return {
    votes,
    fetchAllVotes,
    fetchVotesStandard,
    fetchVotesEmergency,
    fetchVotesZero,
    fetchVotes,
    getBy,
    add,
  };
});
