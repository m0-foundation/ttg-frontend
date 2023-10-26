import { Hash } from "viem";
import { storeToRefs } from "pinia";
import { useProposalsStore } from "@/stores/proposals";
import { useSpogStore } from "@/stores/spog";
import { watchDualGovernorEvent } from "@/lib/sdk";

export const watchProposalCreated = () => {
  console.log("watchProposalCreated");
  const spog = storeToRefs(useSpogStore());
  const network = useNetworkStore().getNetwork();
  const apiStore = useApiClientStore();
  const proposals = useProposalsStore();

  watchDualGovernorEvent(
    {
      address: spog.contracts.value.governor as Hash,
      eventName: "ProposalCreated",
      chainId: network.value.rpc.chainId,
    },
    async (logs) => {
      console.log("newProposalCreated", logs);

      const newProposals = await Promise.all(
        logs.map((log) =>
          apiStore.client.governor?.proposals.getProposalFromWatchLog(log)
        )
      );

      proposals.setProposals(newProposals);
    }
  );
};
