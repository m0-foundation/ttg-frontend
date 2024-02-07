import { Hash, Log } from "viem";
import { storeToRefs } from "pinia";
import { Governor } from "../api/modules/governor";
import { useVotesStore } from "@/stores/votes";
import { useSpogStore } from "@/stores/spog";
import {
  watchStandardGovernorEvent,
  watchEmergencyGovernorEvent,
  watchZeroGovernorEvent,
} from "@/lib/sdk";
import { MVote } from "@/lib/api/types";

async function updateProposalsStore(newVotes: MVote[], governor: Governor) {
  const proposals = useProposalsStore();

  const newTallies = await Promise.all(
    newVotes.map((vote) =>
      governor.proposals!.getProposalTallies(vote.proposalId!)
    )
  );

  newVotes.forEach((vote) => {
    const proposal = newTallies.find((t) => t?.proposalId === vote.proposalId);
    if (proposal) {
      proposals.updateProposalByKey(
        vote.proposalId!,
        "tallies",
        proposal.tallies
      );
    }
  });
}

export const watchVoteCast = () => {
  console.log("watchVoteCast");
  const spog = storeToRefs(useSpogStore());
  const network = useNetworkStore().getNetwork();
  const api = useApiClientStore();
  const votesStore = useVotesStore();
  const wagmiConfig = useWagmiConfig();

  const onEvent = async (logs: Log[], governor: Governor) => {
    console.log("newVoteCast", logs);

    const newVotes = await Promise.all(
      logs.map((log) => governor.voting.decodeVote(log))
    );

    votesStore.push(newVotes);

    return updateProposalsStore(newVotes, governor);
  };

  const unwatchStandard = watchStandardGovernorEvent(wagmiConfig, {
    address: spog.contracts.value.standardGovernor as Hash,
    eventName: "VoteCast",
    chainId: network.value.rpc.chainId,
    onLogs: (logs) => onEvent(logs, api.client.standardGovernor as Governor),
  });

  const unwatchEmergency = watchEmergencyGovernorEvent(wagmiConfig, {
    address: spog.contracts.value.emergencyGovernor as Hash,
    eventName: "VoteCast",
    chainId: network.value.rpc.chainId,
    onLogs: (logs) => onEvent(logs, api.client.emergencyGovernor as Governor),
  });

  const unwatchZero = watchZeroGovernorEvent(wagmiConfig, {
    address: spog.contracts.value.zeroGovernor as Hash,
    eventName: "VoteCast",
    chainId: network.value.rpc.chainId,
    onLogs: (logs) => onEvent(logs, api.client.zeroGovernor as Governor),
  });

  return {
    unwatchAll: () => {
      unwatchStandard();
      unwatchEmergency();
      unwatchZero();
    },
  };
};
