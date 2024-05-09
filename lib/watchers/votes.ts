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

export const watchVoteCast = (votinType: "Standard" | "Emergency" | "Zero") => {
  console.log("watchVoteCast");
  const ttg = storeToRefs(useSpogStore());
  const network = useNetworkStore().getNetwork();
  const api = useApiClientStore();
  const votesStore = useVotesStore();
  const proposalStore = useProposalsStore();
  const wagmiConfig = useWagmiConfig();

  const onEvent = async (logs: Log[], governor: Governor) => {
    console.log("newVoteCast", logs);

    const newVotes = await Promise.all(
      logs.map((log) => governor.voting.decodeVote(log)),
    );

    votesStore.add(newVotes);

    // update tally
    await Promise.all(
      newVotes.map((vote) =>
        proposalStore.updateProposalById(vote.proposalId!),
      ),
    );
  };

  if (votinType === "Standard") {
    console.log("watchStandard");
    const unwatchStandard = watchStandardGovernorEvent(wagmiConfig, {
      address: ttg.contracts.value.standardGovernor as Hash,
      eventName: "VoteCast",
      chainId: network.value.rpc.chainId,
      onLogs: (logs) => onEvent(logs, api.client.standardGovernor as Governor),
    });

    return {
      unwatchAll: () => {
        unwatchStandard();
      },
    };
  }

  if (votinType === "Emergency") {
    console.log("watchEmergencyVotes");
    const unwatchEmergency = watchEmergencyGovernorEvent(wagmiConfig, {
      address: ttg.contracts.value.emergencyGovernor as Hash,
      eventName: "VoteCast",
      chainId: network.value.rpc.chainId,
      onLogs: (logs) => onEvent(logs, api.client.emergencyGovernor as Governor),
    });

    return {
      unwatchAll: () => {
        unwatchEmergency();
      },
    };
  }

  if (votinType === "Zero") {
    console.log("watchZeroVotes");
    const unwatchZero = watchZeroGovernorEvent(wagmiConfig, {
      address: ttg.contracts.value.zeroGovernor as Hash,
      eventName: "VoteCast",
      chainId: network.value.rpc.chainId,
      onLogs: (logs) => onEvent(logs, api.client.zeroGovernor as Governor),
    });

    return {
      unwatchAll: () => {
        unwatchZero();
      },
    };
  }

  return {
    unwatchAll: () => {},
  };
};
