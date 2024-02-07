import { Hash } from "viem";
import { storeToRefs } from "pinia";
import { MProposal } from "../api/types";
import { useProposalsStore } from "@/stores/proposals";
import { useSpogStore } from "@/stores/spog";
import {
  watchStandardGovernorEvent,
  watchEmergencyGovernorEvent,
  watchZeroGovernorEvent,
} from "@/lib/sdk";

export const watchProposalCreated = (callbackOnEvent: Function) => {
  console.log("watchProposalCreated");
  const spog = storeToRefs(useSpogStore());
  const network = useNetworkStore().getNetwork();
  const api = useApiClientStore();
  const proposals = useProposalsStore();
  const wagmiConfig = useWagmiConfig();

  const onEvent = async (logs, governor) => {
    console.log("newProposalCreated", { logs });

    const newProposals = await Promise.all(
      logs.map((log) => governor.proposals.getProposalFromWatchLog(log))
    );

    proposals.push(newProposals as Array<MProposal>);

    callbackOnEvent(newProposals);
  };

  const unwatchStandard = watchStandardGovernorEvent(wagmiConfig, {
    address: spog.contracts.value.standardGovernor as Hash,
    eventName: "ProposalCreated",
    chainId: network.value.rpc.chainId,
    onLogs: (logs) => onEvent(logs, api.client.standardGovernor),
  });

  const unwatchEmergency = watchEmergencyGovernorEvent(wagmiConfig, {
    address: spog.contracts.value.emergencyGovernor as Hash,
    eventName: "ProposalCreated",
    chainId: network.value.rpc.chainId,
    onLogs: (logs) => onEvent(logs, api.client.emergencyGovernor),
  });

  const unwatchZero = watchZeroGovernorEvent(wagmiConfig, {
    address: spog.contracts.value.zeroGovernor as Hash,
    eventName: "ProposalCreated",
    chainId: network.value.rpc.chainId,
    onLogs: (logs) => onEvent(logs, api.client.zeroGovernor),
  });

  return {
    unwatchAll: () => {
      unwatchStandard();
      unwatchEmergency();
      unwatchZero();
    },
  };
};
