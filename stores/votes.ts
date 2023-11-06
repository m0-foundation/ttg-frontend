import _ from "lodash";
import { MVote } from "@/lib/api/types";

export const useVotesStore = defineStore("votes", () => {
  const api = useApiClientStore();

  const votes = ref<Array<MVote>>([]);

  async function fetchAllVotes() {
    await api.client
      .governor!.voting!.getAllVotes()
      .then((data) => (votes.value = data))
      .catch((e) => {
        console.error(e);
      });
  }

  function getBy(key: keyof MVote, value: string) {
    return computed(() => votes.value.filter((v) => v[key] === value));
  }

  function push(addVotes: MVote[]) {
    votes.value = [
      ..._.uniqBy([...votes.value, ...addVotes], "transactionHash"),
    ];
  }

  return { votes, fetchAllVotes, getBy, push };
});
