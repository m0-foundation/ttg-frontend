import { Hash } from "viem";
import { MVotingType } from "@/lib/api/types";
import {
  standardGovernorABI,
  emergencyGovernorABI,
  zeroGovernorABI,
} from "@/lib/sdk";

export const useGovernor = ({
  votingType,
  proposalId,
}: {
  votingType?: MVotingType;
  proposalId?: string;
}) => {
  const spog = useSpogStore();
  const proposalStore = useProposalsStore();

  let type;

  if (proposalId) {
    const proposal = proposalStore.getProposalById(proposalId);
    if (proposal) {
      type = proposal.votingType!;
    }
  } else {
    type = votingType;
  }

  if (type === "Standard") {
    return {
      address: spog.contracts.standardGovernor as Hash,
      abi: standardGovernorABI,
    };
  }

  if (votingType === "Emergency") {
    return {
      address: spog.contracts.emergencyGovernor as Hash,
      abi: emergencyGovernorABI,
    };
  }

  if (votingType === "Zero") {
    return {
      address: spog.contracts.zeroGovernor as Hash,
      abi: zeroGovernorABI,
    };
  }
};
