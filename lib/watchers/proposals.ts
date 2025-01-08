import { Hash } from "viem";
import { storeToRefs } from "pinia";
import { MProposal } from "../api/types";
import { useProposalsStore } from "@/stores/proposals";
import {
  watchStandardGovernorEvent,
  watchEmergencyGovernorEvent,
  watchZeroGovernorEvent,
} from "@/lib/sdk";

export const watchProposalCreated = (callbackOnEvent: Function) => {
  const ttg = storeToRefs(useTtgStore());
  const network = useNetworkStore().getNetwork();
  const api = useApiClientStore();
  const proposals = useProposalsStore();
  const wagmiConfig = useWagmiConfig();

  const onEvent = async (logs, governor) => {
    const newProposals = await Promise.all(
      logs.map((log) => governor.proposals.getProposalFromWatchLog(log)),
    );

    proposals.push(newProposals as Array<MProposal>);

    await callbackOnEvent(newProposals);
  };

  const unwatchStandard = watchStandardGovernorEvent(wagmiConfig, {
    address: ttg.contracts.value.standardGovernor as Hash,
    eventName: "ProposalCreated",
    chainId: network.value.rpc.chainId,
    onLogs: (logs) => onEvent(logs, api.client.standardGovernor),
  });

  const unwatchEmergency = watchEmergencyGovernorEvent(wagmiConfig, {
    address: ttg.contracts.value.emergencyGovernor as Hash,
    eventName: "ProposalCreated",
    chainId: network.value.rpc.chainId,
    onLogs: (logs) => onEvent(logs, api.client.emergencyGovernor),
  });

  const unwatchZero = watchZeroGovernorEvent(wagmiConfig, {
    address: ttg.contracts.value.zeroGovernor as Hash,
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
