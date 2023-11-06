import { Hash } from "viem";
import { storeToRefs } from "pinia";
import { useVotesStore } from "@/stores/votes";
import { useSpogStore } from "@/stores/spog";
import { watchDualGovernorEvent } from "@/lib/sdk";

export const watchVoteCast = () => {
  console.log("watchVoteCast");
  const spog = storeToRefs(useSpogStore());
  const network = useNetworkStore().getNetwork();
  const apiStore = useApiClientStore();

  const votesStore = useVotesStore();

  watchDualGovernorEvent(
    {
      address: spog.contracts.value.governor as Hash,
      eventName: "VoteCast",
      chainId: network.value.rpc.chainId,
    },
    async (logs) => {
      console.log("newVoteCast", logs);

      const newVotes = await Promise.all(
        logs.map((log) => apiStore.client.governor!.voting.decodeVote(log))
      );

      votesStore.push(newVotes);
    }
  );
};
