import _ from "lodash";
import { MVote } from "@/lib/api/types";

export const useVotesStore = defineStore("votes", () => {
  const api = useApiClientStore();

  const votes = ref<Array<MVote>>([]);

  async function fetchAllVotes() {
    const [standardVotes, emergencyVotes, zeroVotes] = await Promise.all([
      api.client!.standardGovernor!.voting!.getAllVotes(),
      api.client.emergencyGovernor!.voting!.getAllVotes(),
      api.client.zeroGovernor!.voting!.getAllVotes(),
    ]);

    votes.value = [...standardVotes, ...emergencyVotes, ...zeroVotes];
  }

  function getBy(key: keyof MVote, value: string) {
    return computed(() => votes.value.filter((v) => v[key] === value));
  }

  function push(addVotes: MVote[]) {
    console.log({ addVotes });
    votes.value = [..._.uniqBy([...votes.value, ...addVotes], "data")];
  }

  return { votes, fetchAllVotes, getBy, push };
});
