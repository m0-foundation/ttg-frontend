import {
  createReadContract,
  createWriteContract,
  createSimulateContract,
  createWatchContractEvent,
} from "@wagmi/core/codegen";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DistributionVault
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const distributionVaultAbi = [
  {
    type: "constructor",
    inputs: [{ name: "zeroToken_", internalType: "address", type: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "CLAIM_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "CLOCK_MODE",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "token_", internalType: "address", type: "address" },
      { name: "startEpoch_", internalType: "uint256", type: "uint256" },
      { name: "endEpoch_", internalType: "uint256", type: "uint256" },
      { name: "destination_", internalType: "address", type: "address" },
    ],
    name: "claim",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "token_", internalType: "address", type: "address" },
      { name: "startEpoch_", internalType: "uint256", type: "uint256" },
      { name: "endEpoch_", internalType: "uint256", type: "uint256" },
      { name: "destination_", internalType: "address", type: "address" },
      { name: "deadline_", internalType: "uint256", type: "uint256" },
      { name: "v_", internalType: "uint8", type: "uint8" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "s_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "claimBySig",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "token_", internalType: "address", type: "address" },
      { name: "startEpoch_", internalType: "uint256", type: "uint256" },
      { name: "endEpoch_", internalType: "uint256", type: "uint256" },
      { name: "destination_", internalType: "address", type: "address" },
      { name: "deadline_", internalType: "uint256", type: "uint256" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "claimBySig",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "clock",
    outputs: [{ name: "", internalType: "uint48", type: "uint48" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "token_", internalType: "address", type: "address" }],
    name: "distribute",
    outputs: [{ name: "amount_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "token", internalType: "address", type: "address" },
      { name: "epoch", internalType: "uint256", type: "uint256" },
    ],
    name: "distributionOfAt",
    outputs: [{ name: "amount", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "eip712Domain",
    outputs: [
      { name: "fields_", internalType: "bytes1", type: "bytes1" },
      { name: "name_", internalType: "string", type: "string" },
      { name: "version_", internalType: "string", type: "string" },
      { name: "chainId_", internalType: "uint256", type: "uint256" },
      { name: "verifyingContract_", internalType: "address", type: "address" },
      { name: "salt_", internalType: "bytes32", type: "bytes32" },
      { name: "extensions_", internalType: "uint256[]", type: "uint256[]" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "token_", internalType: "address", type: "address" },
      { name: "startEpoch_", internalType: "uint256", type: "uint256" },
      { name: "endEpoch_", internalType: "uint256", type: "uint256" },
      { name: "destination_", internalType: "address", type: "address" },
      { name: "nonce_", internalType: "uint256", type: "uint256" },
      { name: "deadline_", internalType: "uint256", type: "uint256" },
    ],
    name: "getClaimDigest",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "token_", internalType: "address", type: "address" },
      { name: "account_", internalType: "address", type: "address" },
      { name: "startEpoch_", internalType: "uint256", type: "uint256" },
      { name: "endEpoch_", internalType: "uint256", type: "uint256" },
    ],
    name: "getClaimable",
    outputs: [{ name: "claimable_", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "token_", internalType: "address", type: "address" }],
    name: "getDistributable",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "token", internalType: "address", type: "address" },
      { name: "epoch", internalType: "uint256", type: "uint256" },
      { name: "account", internalType: "address", type: "address" },
    ],
    name: "hasClaimed",
    outputs: [{ name: "claimed", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "account", internalType: "address", type: "address" }],
    name: "nonces",
    outputs: [{ name: "nonce", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "zeroToken",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "token",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "account",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "startEpoch",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "endEpoch",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "amount",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Claim",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "token",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "epoch",
        internalType: "uint256",
        type: "uint256",
        indexed: true,
      },
      {
        name: "amount",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Distribution",
  },
  { type: "event", anonymous: false, inputs: [], name: "EIP712DomainChanged" },
  {
    type: "error",
    inputs: [
      { name: "nonce", internalType: "uint256", type: "uint256" },
      { name: "expectedNonce", internalType: "uint256", type: "uint256" },
    ],
    name: "InvalidAccountNonce",
  },
  { type: "error", inputs: [], name: "InvalidDestinationAddress" },
  { type: "error", inputs: [], name: "InvalidSignature" },
  { type: "error", inputs: [], name: "InvalidSignatureLength" },
  { type: "error", inputs: [], name: "InvalidSignatureS" },
  { type: "error", inputs: [], name: "InvalidSignatureV" },
  { type: "error", inputs: [], name: "InvalidZeroTokenAddress" },
  {
    type: "error",
    inputs: [
      { name: "timepoint", internalType: "uint256", type: "uint256" },
      { name: "clock", internalType: "uint256", type: "uint256" },
    ],
    name: "NotPastTimepoint",
  },
  {
    type: "error",
    inputs: [
      { name: "deadline", internalType: "uint256", type: "uint256" },
      { name: "timestamp", internalType: "uint256", type: "uint256" },
    ],
    name: "SignatureExpired",
  },
  { type: "error", inputs: [], name: "SignerMismatch" },
  {
    type: "error",
    inputs: [
      { name: "startEpoch", internalType: "uint256", type: "uint256" },
      { name: "endEpoch", internalType: "uint256", type: "uint256" },
    ],
    name: "StartEpochAfterEndEpoch",
  },
  { type: "error", inputs: [], name: "TransferFailed" },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EmergencyGovernor
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const emergencyGovernorAbi = [
  {
    type: "constructor",
    inputs: [
      { name: "voteToken_", internalType: "address", type: "address" },
      { name: "zeroGovernor_", internalType: "address", type: "address" },
      { name: "registrar_", internalType: "address", type: "address" },
      { name: "standardGovernor_", internalType: "address", type: "address" },
      { name: "thresholdRatio_", internalType: "uint16", type: "uint16" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "BALLOTS_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "BALLOTS_WITH_REASON_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "BALLOT_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "BALLOT_WITH_REASON_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "CLOCK_MODE",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [],
    name: "COUNTING_MODE",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "ONE",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "list_", internalType: "bytes32", type: "bytes32" },
      { name: "account_", internalType: "address", type: "address" },
    ],
    name: "addToList",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
    ],
    name: "castVote",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
      { name: "v_", internalType: "uint8", type: "uint8" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "s_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "castVoteBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "voter_", internalType: "address", type: "address" },
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "castVoteBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
      { name: "reason_", internalType: "string", type: "string" },
    ],
    name: "castVoteWithReason",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "voter_", internalType: "address", type: "address" },
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
      { name: "reason_", internalType: "string", type: "string" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "castVoteWithReasonBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
      { name: "reason_", internalType: "string", type: "string" },
      { name: "v_", internalType: "uint8", type: "uint8" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "s_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "castVoteWithReasonBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
    ],
    name: "castVotes",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "voter_", internalType: "address", type: "address" },
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "castVotesBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
      { name: "v_", internalType: "uint8", type: "uint8" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "s_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "castVotesBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
      { name: "reasonList_", internalType: "string[]", type: "string[]" },
    ],
    name: "castVotesWithReason",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "voter_", internalType: "address", type: "address" },
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
      { name: "reasonList_", internalType: "string[]", type: "string[]" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "castVotesWithReasonBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
      { name: "reasonList_", internalType: "string[]", type: "string[]" },
      { name: "v_", internalType: "uint8", type: "uint8" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "s_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "castVotesWithReasonBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "clock",
    outputs: [{ name: "", internalType: "uint48", type: "uint48" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "eip712Domain",
    outputs: [
      { name: "fields_", internalType: "bytes1", type: "bytes1" },
      { name: "name_", internalType: "string", type: "string" },
      { name: "version_", internalType: "string", type: "string" },
      { name: "chainId_", internalType: "uint256", type: "uint256" },
      { name: "verifyingContract_", internalType: "address", type: "address" },
      { name: "salt_", internalType: "bytes32", type: "bytes32" },
      { name: "extensions_", internalType: "uint256[]", type: "uint256[]" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "", internalType: "address[]", type: "address[]" },
      { name: "", internalType: "uint256[]", type: "uint256[]" },
      { name: "callDatas_", internalType: "bytes[]", type: "bytes[]" },
      { name: "", internalType: "bytes32", type: "bytes32" },
    ],
    name: "execute",
    outputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
    ],
    name: "getBallotDigest",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
      { name: "reason_", internalType: "string", type: "string" },
    ],
    name: "getBallotWithReasonDigest",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
    ],
    name: "getBallotsDigest",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
      { name: "reasonList_", internalType: "string[]", type: "string[]" },
    ],
    name: "getBallotsWithReasonDigest",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "getProposal",
    outputs: [
      { name: "voteStart_", internalType: "uint48", type: "uint48" },
      { name: "voteEnd_", internalType: "uint48", type: "uint48" },
      {
        name: "state_",
        internalType: "enum IGovernor.ProposalState",
        type: "uint8",
      },
      { name: "noVotes_", internalType: "uint256", type: "uint256" },
      { name: "yesVotes_", internalType: "uint256", type: "uint256" },
      { name: "proposer_", internalType: "address", type: "address" },
      { name: "quorum_", internalType: "uint256", type: "uint256" },
      { name: "quorumNumerator_", internalType: "uint16", type: "uint16" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "timepoint_", internalType: "uint256", type: "uint256" },
    ],
    name: "getVotes",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalId", internalType: "uint256", type: "uint256" },
      { name: "voter", internalType: "address", type: "address" },
    ],
    name: "hasVoted",
    outputs: [{ name: "hasVoted", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "callData_", internalType: "bytes", type: "bytes" }],
    name: "hashProposal",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "", internalType: "address[]", type: "address[]" },
      { name: "", internalType: "uint256[]", type: "uint256[]" },
      { name: "callDatas_", internalType: "bytes[]", type: "bytes[]" },
      { name: "", internalType: "bytes32", type: "bytes32" },
    ],
    name: "hashProposal",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "proposalDeadline",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "proposalProposer",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "proposalId", internalType: "uint256", type: "uint256" }],
    name: "proposalQuorum",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "proposalSnapshot",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "proposalThreshold",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "proposalVotes",
    outputs: [
      { name: "", internalType: "uint256", type: "uint256" },
      { name: "", internalType: "uint256", type: "uint256" },
      { name: "", internalType: "uint256", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "targets_", internalType: "address[]", type: "address[]" },
      { name: "values_", internalType: "uint256[]", type: "uint256[]" },
      { name: "callDatas_", internalType: "bytes[]", type: "bytes[]" },
      { name: "description_", internalType: "string", type: "string" },
    ],
    name: "propose",
    outputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "quorum",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "quorumDenominator",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [],
    name: "quorumNumerator",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "registrar",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "list_", internalType: "bytes32", type: "bytes32" },
      { name: "accountToRemove_", internalType: "address", type: "address" },
      { name: "accountToAdd_", internalType: "address", type: "address" },
    ],
    name: "removeFromAndAddToList",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "list_", internalType: "bytes32", type: "bytes32" },
      { name: "account_", internalType: "address", type: "address" },
    ],
    name: "removeFromList",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "key_", internalType: "bytes32", type: "bytes32" },
      { name: "value_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "setKey",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "newProposalFee_", internalType: "uint256", type: "uint256" },
    ],
    name: "setStandardProposalFee",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "newThresholdRatio_", internalType: "uint16", type: "uint16" },
    ],
    name: "setThresholdRatio",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "standardGovernor",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "state",
    outputs: [
      {
        name: "state_",
        internalType: "enum IGovernor.ProposalState",
        type: "uint8",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "thresholdRatio",
    outputs: [{ name: "", internalType: "uint16", type: "uint16" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "token",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "voteToken",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "votingDelay",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "votingPeriod",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "zeroGovernor",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  { type: "event", anonymous: false, inputs: [], name: "EIP712DomainChanged" },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "proposalId",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "proposer",
        internalType: "address",
        type: "address",
        indexed: false,
      },
      {
        name: "targets",
        internalType: "address[]",
        type: "address[]",
        indexed: false,
      },
      {
        name: "values",
        internalType: "uint256[]",
        type: "uint256[]",
        indexed: false,
      },
      {
        name: "signatures",
        internalType: "string[]",
        type: "string[]",
        indexed: false,
      },
      {
        name: "callDatas",
        internalType: "bytes[]",
        type: "bytes[]",
        indexed: false,
      },
      {
        name: "voteStart",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "voteEnd",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "description",
        internalType: "string",
        type: "string",
        indexed: false,
      },
    ],
    name: "ProposalCreated",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "proposalId",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "ProposalExecuted",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "oldQuorumNumerator",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "newQuorumNumerator",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "QuorumNumeratorUpdated",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "thresholdRatio",
        internalType: "uint16",
        type: "uint16",
        indexed: false,
      },
    ],
    name: "ThresholdRatioSet",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "voter",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "proposalId",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      { name: "support", internalType: "uint8", type: "uint8", indexed: false },
      {
        name: "weight",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "reason",
        internalType: "string",
        type: "string",
        indexed: false,
      },
    ],
    name: "VoteCast",
  },
  { type: "error", inputs: [], name: "AlreadyVoted" },
  {
    type: "error",
    inputs: [
      { name: "length1", internalType: "uint256", type: "uint256" },
      { name: "length2", internalType: "uint256", type: "uint256" },
    ],
    name: "ArrayLengthMismatch",
  },
  { type: "error", inputs: [], name: "EmptyProposalIdsArray" },
  {
    type: "error",
    inputs: [{ name: "data", internalType: "bytes", type: "bytes" }],
    name: "ExecutionFailed",
  },
  { type: "error", inputs: [], name: "InvalidCallData" },
  { type: "error", inputs: [], name: "InvalidCallDatasLength" },
  { type: "error", inputs: [], name: "InvalidRegistrarAddress" },
  { type: "error", inputs: [], name: "InvalidSignature" },
  { type: "error", inputs: [], name: "InvalidSignatureLength" },
  { type: "error", inputs: [], name: "InvalidSignatureS" },
  { type: "error", inputs: [], name: "InvalidSignatureV" },
  { type: "error", inputs: [], name: "InvalidStandardGovernorAddress" },
  { type: "error", inputs: [], name: "InvalidTarget" },
  { type: "error", inputs: [], name: "InvalidTargetsLength" },
  {
    type: "error",
    inputs: [
      { name: "thresholdRatio", internalType: "uint256", type: "uint256" },
      { name: "minThresholdRatio", internalType: "uint256", type: "uint256" },
      { name: "maxThresholdRatio", internalType: "uint256", type: "uint256" },
    ],
    name: "InvalidThresholdRatio",
  },
  { type: "error", inputs: [], name: "InvalidValue" },
  { type: "error", inputs: [], name: "InvalidValuesLength" },
  { type: "error", inputs: [], name: "InvalidVoteStart" },
  { type: "error", inputs: [], name: "InvalidVoteTokenAddress" },
  { type: "error", inputs: [], name: "InvalidZeroGovernorAddress" },
  { type: "error", inputs: [], name: "NotSelf" },
  { type: "error", inputs: [], name: "NotZeroGovernor" },
  { type: "error", inputs: [], name: "ProposalCannotBeExecuted" },
  { type: "error", inputs: [], name: "ProposalDoesNotExist" },
  { type: "error", inputs: [], name: "ProposalExists" },
  {
    type: "error",
    inputs: [
      {
        name: "state",
        internalType: "enum IGovernor.ProposalState",
        type: "uint8",
      },
    ],
    name: "ProposalInactive",
  },
  {
    type: "error",
    inputs: [
      { name: "deadline", internalType: "uint256", type: "uint256" },
      { name: "timestamp", internalType: "uint256", type: "uint256" },
    ],
    name: "SignatureExpired",
  },
  { type: "error", inputs: [], name: "SignerMismatch" },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PowerToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const powerTokenAbi = [
  {
    type: "constructor",
    inputs: [
      { name: "bootstrapToken_", internalType: "address", type: "address" },
      { name: "standardGovernor_", internalType: "address", type: "address" },
      { name: "cashToken_", internalType: "address", type: "address" },
      { name: "vault_", internalType: "address", type: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "CANCEL_AUTHORIZATION_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "CLOCK_MODE",
    outputs: [{ name: "clockMode_", internalType: "string", type: "string" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [],
    name: "DELEGATION_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "INITIAL_SUPPLY",
    outputs: [{ name: "", internalType: "uint240", type: "uint240" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "ONE",
    outputs: [{ name: "", internalType: "uint16", type: "uint16" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "PERMIT_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "RECEIVE_WITH_AUTHORIZATION_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "TRANSFER_WITH_AUTHORIZATION_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "account", internalType: "address", type: "address" },
      { name: "spender", internalType: "address", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "allowance", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "amountToAuction",
    outputs: [{ name: "", internalType: "uint240", type: "uint240" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "spender_", internalType: "address", type: "address" },
      { name: "amount_", internalType: "uint256", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "success_", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "authorizer", internalType: "address", type: "address" },
      { name: "nonce", internalType: "bytes32", type: "bytes32" },
    ],
    name: "authorizationState",
    outputs: [{ name: "isNonceUsed", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "account_", internalType: "address", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "bootstrapEpoch",
    outputs: [{ name: "", internalType: "uint16", type: "uint16" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "bootstrapToken",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "minAmount_", internalType: "uint256", type: "uint256" },
      { name: "maxAmount_", internalType: "uint256", type: "uint256" },
      { name: "destination_", internalType: "address", type: "address" },
      { name: "expiryEpoch_", internalType: "uint16", type: "uint16" },
    ],
    name: "buy",
    outputs: [
      { name: "amount_", internalType: "uint240", type: "uint240" },
      { name: "cost_", internalType: "uint256", type: "uint256" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "authorizer_", internalType: "address", type: "address" },
      { name: "nonce_", internalType: "bytes32", type: "bytes32" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "vs_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "cancelAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "authorizer_", internalType: "address", type: "address" },
      { name: "nonce_", internalType: "bytes32", type: "bytes32" },
      { name: "v_", internalType: "uint8", type: "uint8" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "s_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "cancelAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "authorizer_", internalType: "address", type: "address" },
      { name: "nonce_", internalType: "bytes32", type: "bytes32" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "cancelAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "cashToken",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "clock",
    outputs: [{ name: "clock_", internalType: "uint48", type: "uint48" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "delegatee_", internalType: "address", type: "address" }],
    name: "delegate",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "delegatee_", internalType: "address", type: "address" },
      { name: "nonce_", internalType: "uint256", type: "uint256" },
      { name: "expiry_", internalType: "uint256", type: "uint256" },
      { name: "v_", internalType: "uint8", type: "uint8" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "s_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "delegateBySig",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "delegatee_", internalType: "address", type: "address" },
      { name: "nonce_", internalType: "uint256", type: "uint256" },
      { name: "expiry_", internalType: "uint256", type: "uint256" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "delegateBySig",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "account_", internalType: "address", type: "address" }],
    name: "delegates",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "eip712Domain",
    outputs: [
      { name: "fields_", internalType: "bytes1", type: "bytes1" },
      { name: "name_", internalType: "string", type: "string" },
      { name: "version_", internalType: "string", type: "string" },
      { name: "chainId_", internalType: "uint256", type: "uint256" },
      { name: "verifyingContract_", internalType: "address", type: "address" },
      { name: "salt_", internalType: "bytes32", type: "bytes32" },
      { name: "extensions_", internalType: "uint256[]", type: "uint256[]" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "amount_", internalType: "uint256", type: "uint256" }],
    name: "getCost",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "delegatee_", internalType: "address", type: "address" },
      { name: "nonce_", internalType: "uint256", type: "uint256" },
      { name: "expiry_", internalType: "uint256", type: "uint256" },
    ],
    name: "getDelegationDigest",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "epoch_", internalType: "uint256", type: "uint256" },
    ],
    name: "getPastVotes",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "account_", internalType: "address", type: "address" }],
    name: "getVotes",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "delegatee_", internalType: "address", type: "address" },
      { name: "epoch_", internalType: "uint256", type: "uint256" },
    ],
    name: "hasParticipatedAt",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "markNextVotingEpochAsActive",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "delegatee_", internalType: "address", type: "address" }],
    name: "markParticipation",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "name_", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "account", internalType: "address", type: "address" }],
    name: "nonces",
    outputs: [{ name: "nonce", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "participationInflation",
    outputs: [{ name: "", internalType: "uint16", type: "uint16" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "epoch_", internalType: "uint256", type: "uint256" },
    ],
    name: "pastBalanceOf",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "epoch_", internalType: "uint256", type: "uint256" },
    ],
    name: "pastDelegates",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "epoch_", internalType: "uint256", type: "uint256" }],
    name: "pastTotalSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "owner_", internalType: "address", type: "address" },
      { name: "spender_", internalType: "address", type: "address" },
      { name: "value_", internalType: "uint256", type: "uint256" },
      { name: "deadline_", internalType: "uint256", type: "uint256" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "owner_", internalType: "address", type: "address" },
      { name: "spender_", internalType: "address", type: "address" },
      { name: "value_", internalType: "uint256", type: "uint256" },
      { name: "deadline_", internalType: "uint256", type: "uint256" },
      { name: "v_", internalType: "uint8", type: "uint8" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "s_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "from_", internalType: "address", type: "address" },
      { name: "to_", internalType: "address", type: "address" },
      { name: "value_", internalType: "uint256", type: "uint256" },
      { name: "validAfter_", internalType: "uint256", type: "uint256" },
      { name: "validBefore_", internalType: "uint256", type: "uint256" },
      { name: "nonce_", internalType: "bytes32", type: "bytes32" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "receiveWithAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "from_", internalType: "address", type: "address" },
      { name: "to_", internalType: "address", type: "address" },
      { name: "value_", internalType: "uint256", type: "uint256" },
      { name: "validAfter_", internalType: "uint256", type: "uint256" },
      { name: "validBefore_", internalType: "uint256", type: "uint256" },
      { name: "nonce_", internalType: "bytes32", type: "bytes32" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "vs_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "receiveWithAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "from_", internalType: "address", type: "address" },
      { name: "to_", internalType: "address", type: "address" },
      { name: "value_", internalType: "uint256", type: "uint256" },
      { name: "validAfter_", internalType: "uint256", type: "uint256" },
      { name: "validBefore_", internalType: "uint256", type: "uint256" },
      { name: "nonce_", internalType: "bytes32", type: "bytes32" },
      { name: "v_", internalType: "uint8", type: "uint8" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "s_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "receiveWithAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "nextCashToken_", internalType: "address", type: "address" },
    ],
    name: "setNextCashToken",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "standardGovernor",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "account_", internalType: "address", type: "address" }],
    name: "sync",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "targetSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "recipient_", internalType: "address", type: "address" },
      { name: "amount_", internalType: "uint256", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "success_", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "sender_", internalType: "address", type: "address" },
      { name: "recipient_", internalType: "address", type: "address" },
      { name: "amount_", internalType: "uint256", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "success_", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "from_", internalType: "address", type: "address" },
      { name: "to_", internalType: "address", type: "address" },
      { name: "value_", internalType: "uint256", type: "uint256" },
      { name: "validAfter_", internalType: "uint256", type: "uint256" },
      { name: "validBefore_", internalType: "uint256", type: "uint256" },
      { name: "nonce_", internalType: "bytes32", type: "bytes32" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "vs_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "transferWithAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "from_", internalType: "address", type: "address" },
      { name: "to_", internalType: "address", type: "address" },
      { name: "value_", internalType: "uint256", type: "uint256" },
      { name: "validAfter_", internalType: "uint256", type: "uint256" },
      { name: "validBefore_", internalType: "uint256", type: "uint256" },
      { name: "nonce_", internalType: "bytes32", type: "bytes32" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "transferWithAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "from_", internalType: "address", type: "address" },
      { name: "to_", internalType: "address", type: "address" },
      { name: "value_", internalType: "uint256", type: "uint256" },
      { name: "validAfter_", internalType: "uint256", type: "uint256" },
      { name: "validBefore_", internalType: "uint256", type: "uint256" },
      { name: "nonce_", internalType: "bytes32", type: "bytes32" },
      { name: "v_", internalType: "uint8", type: "uint8" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "s_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "transferWithAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "vault",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "account",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "spender",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "amount",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Approval",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "authorizer",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "nonce",
        internalType: "bytes32",
        type: "bytes32",
        indexed: true,
      },
    ],
    name: "AuthorizationCanceled",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "authorizer",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "nonce",
        internalType: "bytes32",
        type: "bytes32",
        indexed: true,
      },
    ],
    name: "AuthorizationUsed",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "buyer",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "amount",
        internalType: "uint240",
        type: "uint240",
        indexed: false,
      },
      {
        name: "cost",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Buy",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "delegator",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "fromDelegatee",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "toDelegatee",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "DelegateChanged",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "delegatee",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "previousBalance",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "newBalance",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "DelegateVotesChanged",
  },
  { type: "event", anonymous: false, inputs: [], name: "EIP712DomainChanged" },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "startingEpoch",
        internalType: "uint16",
        type: "uint16",
        indexed: true,
      },
      {
        name: "nextCashToken",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "NextCashTokenSet",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "account",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "Sync",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "tagline",
        internalType: "string",
        type: "string",
        indexed: false,
      },
    ],
    name: "Tagline",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "targetEpoch",
        internalType: "uint16",
        type: "uint16",
        indexed: true,
      },
      {
        name: "targetSupply",
        internalType: "uint240",
        type: "uint240",
        indexed: true,
      },
    ],
    name: "TargetSupplyInflated",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "sender",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "recipient",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "amount",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Transfer",
  },
  { type: "error", inputs: [], name: "AlreadyParticipated" },
  {
    type: "error",
    inputs: [
      { name: "authorizer", internalType: "address", type: "address" },
      { name: "nonce", internalType: "bytes32", type: "bytes32" },
    ],
    name: "AuthorizationAlreadyUsed",
  },
  {
    type: "error",
    inputs: [
      { name: "timestamp", internalType: "uint256", type: "uint256" },
      { name: "validBefore", internalType: "uint256", type: "uint256" },
    ],
    name: "AuthorizationExpired",
  },
  {
    type: "error",
    inputs: [
      { name: "timestamp", internalType: "uint256", type: "uint256" },
      { name: "validAfter", internalType: "uint256", type: "uint256" },
    ],
    name: "AuthorizationNotYetValid",
  },
  { type: "error", inputs: [], name: "BootstrapSupplyTooLarge" },
  { type: "error", inputs: [], name: "BootstrapSupplyZero" },
  {
    type: "error",
    inputs: [
      { name: "caller", internalType: "address", type: "address" },
      { name: "payee", internalType: "address", type: "address" },
    ],
    name: "CallerMustBePayee",
  },
  { type: "error", inputs: [], name: "DivisionByZero" },
  { type: "error", inputs: [], name: "EpochZero" },
  { type: "error", inputs: [], name: "ExpiredBuyOrder" },
  {
    type: "error",
    inputs: [
      { name: "currentEpoch", internalType: "uint16", type: "uint16" },
      { name: "epoch", internalType: "uint16", type: "uint16" },
    ],
    name: "FutureEpoch",
  },
  { type: "error", inputs: [], name: "InflationTooHigh" },
  {
    type: "error",
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "allowance", internalType: "uint256", type: "uint256" },
      { name: "needed", internalType: "uint256", type: "uint256" },
    ],
    name: "InsufficientAllowance",
  },
  {
    type: "error",
    inputs: [{ name: "amount", internalType: "uint256", type: "uint256" }],
    name: "InsufficientAmount",
  },
  {
    type: "error",
    inputs: [
      { name: "amountToAuction", internalType: "uint240", type: "uint240" },
      { name: "minAmountRequested", internalType: "uint240", type: "uint240" },
    ],
    name: "InsufficientAuctionSupply",
  },
  {
    type: "error",
    inputs: [
      { name: "nonce", internalType: "uint256", type: "uint256" },
      { name: "expectedNonce", internalType: "uint256", type: "uint256" },
    ],
    name: "InvalidAccountNonce",
  },
  { type: "error", inputs: [], name: "InvalidBootstrapTokenAddress" },
  { type: "error", inputs: [], name: "InvalidCashTokenAddress" },
  {
    type: "error",
    inputs: [{ name: "recipient", internalType: "address", type: "address" }],
    name: "InvalidRecipient",
  },
  { type: "error", inputs: [], name: "InvalidSignature" },
  { type: "error", inputs: [], name: "InvalidSignatureLength" },
  { type: "error", inputs: [], name: "InvalidSignatureS" },
  { type: "error", inputs: [], name: "InvalidSignatureV" },
  { type: "error", inputs: [], name: "InvalidStandardGovernorAddress" },
  { type: "error", inputs: [], name: "InvalidUInt16" },
  { type: "error", inputs: [], name: "InvalidUInt240" },
  { type: "error", inputs: [], name: "InvalidVaultAddress" },
  {
    type: "error",
    inputs: [
      { name: "timepoint", internalType: "uint48", type: "uint48" },
      { name: "clock", internalType: "uint48", type: "uint48" },
    ],
    name: "NotPastTimepoint",
  },
  { type: "error", inputs: [], name: "NotStandardGovernor" },
  { type: "error", inputs: [], name: "NotVoteEpoch" },
  {
    type: "error",
    inputs: [
      { name: "deadline", internalType: "uint256", type: "uint256" },
      { name: "timestamp", internalType: "uint256", type: "uint256" },
    ],
    name: "SignatureExpired",
  },
  { type: "error", inputs: [], name: "SignerMismatch" },
  {
    type: "error",
    inputs: [
      { name: "bootstrapEpoch", internalType: "uint16", type: "uint16" },
      { name: "epoch", internalType: "uint16", type: "uint16" },
    ],
    name: "SyncBeforeBootstrap",
  },
  { type: "error", inputs: [], name: "TransferFromFailed" },
  { type: "error", inputs: [], name: "VoteEpoch" },
  { type: "error", inputs: [], name: "ZeroPurchaseAmount" },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Registrar
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const registrarAbi = [
  {
    type: "constructor",
    inputs: [
      { name: "zeroGovernor_", internalType: "address", type: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "CLOCK_MODE",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [
      { name: "list_", internalType: "bytes32", type: "bytes32" },
      { name: "account_", internalType: "address", type: "address" },
    ],
    name: "addToList",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "clock",
    outputs: [{ name: "", internalType: "uint48", type: "uint48" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "clockPeriod",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [],
    name: "clockStartingTimestamp",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [],
    name: "emergencyGovernor",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "emergencyGovernorDeployer",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "key_", internalType: "bytes32", type: "bytes32" }],
    name: "get",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "keys_", internalType: "bytes32[]", type: "bytes32[]" }],
    name: "get",
    outputs: [
      { name: "values_", internalType: "bytes32[]", type: "bytes32[]" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "list_", internalType: "bytes32", type: "bytes32" },
      { name: "accounts_", internalType: "address[]", type: "address[]" },
    ],
    name: "listContains",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "list_", internalType: "bytes32", type: "bytes32" },
      { name: "account_", internalType: "address", type: "address" },
    ],
    name: "listContains",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "powerToken",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "powerTokenDeployer",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "list_", internalType: "bytes32", type: "bytes32" },
      { name: "account_", internalType: "address", type: "address" },
    ],
    name: "removeFromList",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "key_", internalType: "bytes32", type: "bytes32" },
      { name: "value_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "setKey",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "standardGovernor",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "standardGovernorDeployer",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "vault",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "zeroGovernor",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "zeroToken",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "list", internalType: "bytes32", type: "bytes32", indexed: true },
      {
        name: "account",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "AddressAddedToList",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "list", internalType: "bytes32", type: "bytes32", indexed: true },
      {
        name: "account",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "AddressRemovedFromList",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "key", internalType: "bytes32", type: "bytes32", indexed: true },
      {
        name: "value",
        internalType: "bytes32",
        type: "bytes32",
        indexed: true,
      },
    ],
    name: "KeySet",
  },
  {
    type: "error",
    inputs: [],
    name: "InvalidEmergencyGovernorDeployerAddress",
  },
  { type: "error", inputs: [], name: "InvalidPowerTokenDeployerAddress" },
  { type: "error", inputs: [], name: "InvalidStandardGovernorDeployerAddress" },
  { type: "error", inputs: [], name: "InvalidVaultAddress" },
  { type: "error", inputs: [], name: "InvalidVoteTokenAddress" },
  { type: "error", inputs: [], name: "InvalidZeroGovernorAddress" },
  { type: "error", inputs: [], name: "NotStandardOrEmergencyGovernor" },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// StandardGovernor
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const standardGovernorAbi = [
  {
    type: "constructor",
    inputs: [
      { name: "voteToken_", internalType: "address", type: "address" },
      { name: "emergencyGovernor_", internalType: "address", type: "address" },
      { name: "zeroGovernor_", internalType: "address", type: "address" },
      { name: "cashToken_", internalType: "address", type: "address" },
      { name: "registrar_", internalType: "address", type: "address" },
      { name: "vault_", internalType: "address", type: "address" },
      { name: "zeroToken_", internalType: "address", type: "address" },
      { name: "proposalFee_", internalType: "uint256", type: "uint256" },
      {
        name: "maxTotalZeroRewardPerActiveEpoch_",
        internalType: "uint256",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "BALLOTS_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "BALLOTS_WITH_REASON_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "BALLOT_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "BALLOT_WITH_REASON_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "CLOCK_MODE",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [],
    name: "COUNTING_MODE",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "list_", internalType: "bytes32", type: "bytes32" },
      { name: "account_", internalType: "address", type: "address" },
    ],
    name: "addToList",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "cashToken",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
    ],
    name: "castVote",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
      { name: "v_", internalType: "uint8", type: "uint8" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "s_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "castVoteBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "voter_", internalType: "address", type: "address" },
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "castVoteBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
      { name: "reason_", internalType: "string", type: "string" },
    ],
    name: "castVoteWithReason",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "voter_", internalType: "address", type: "address" },
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
      { name: "reason_", internalType: "string", type: "string" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "castVoteWithReasonBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
      { name: "reason_", internalType: "string", type: "string" },
      { name: "v_", internalType: "uint8", type: "uint8" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "s_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "castVoteWithReasonBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
    ],
    name: "castVotes",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "voter_", internalType: "address", type: "address" },
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "castVotesBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
      { name: "v_", internalType: "uint8", type: "uint8" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "s_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "castVotesBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
      { name: "reasonList_", internalType: "string[]", type: "string[]" },
    ],
    name: "castVotesWithReason",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "voter_", internalType: "address", type: "address" },
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
      { name: "reasonList_", internalType: "string[]", type: "string[]" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "castVotesWithReasonBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
      { name: "reasonList_", internalType: "string[]", type: "string[]" },
      { name: "v_", internalType: "uint8", type: "uint8" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "s_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "castVotesWithReasonBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "clock",
    outputs: [{ name: "", internalType: "uint48", type: "uint48" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "eip712Domain",
    outputs: [
      { name: "fields_", internalType: "bytes1", type: "bytes1" },
      { name: "name_", internalType: "string", type: "string" },
      { name: "version_", internalType: "string", type: "string" },
      { name: "chainId_", internalType: "uint256", type: "uint256" },
      { name: "verifyingContract_", internalType: "address", type: "address" },
      { name: "salt_", internalType: "bytes32", type: "bytes32" },
      { name: "extensions_", internalType: "uint256[]", type: "uint256[]" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "emergencyGovernor",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "", internalType: "address[]", type: "address[]" },
      { name: "", internalType: "uint256[]", type: "uint256[]" },
      { name: "callDatas_", internalType: "bytes[]", type: "bytes[]" },
      { name: "", internalType: "bytes32", type: "bytes32" },
    ],
    name: "execute",
    outputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
    ],
    name: "getBallotDigest",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
      { name: "reason_", internalType: "string", type: "string" },
    ],
    name: "getBallotWithReasonDigest",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
    ],
    name: "getBallotsDigest",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
      { name: "reasonList_", internalType: "string[]", type: "string[]" },
    ],
    name: "getBallotsWithReasonDigest",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "getProposal",
    outputs: [
      { name: "voteStart_", internalType: "uint48", type: "uint48" },
      { name: "voteEnd_", internalType: "uint48", type: "uint48" },
      {
        name: "state_",
        internalType: "enum IGovernor.ProposalState",
        type: "uint8",
      },
      { name: "noVotes_", internalType: "uint256", type: "uint256" },
      { name: "yesVotes_", internalType: "uint256", type: "uint256" },
      { name: "proposer_", internalType: "address", type: "address" },
      { name: "quorum_", internalType: "uint256", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "getProposalFee",
    outputs: [
      { name: "cashToken_", internalType: "address", type: "address" },
      { name: "fee_", internalType: "uint256", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "timepoint_", internalType: "uint256", type: "uint256" },
    ],
    name: "getVotes",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalId", internalType: "uint256", type: "uint256" },
      { name: "voter", internalType: "address", type: "address" },
    ],
    name: "hasVoted",
    outputs: [{ name: "hasVoted", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "voter_", internalType: "address", type: "address" },
      { name: "epoch_", internalType: "uint256", type: "uint256" },
    ],
    name: "hasVotedOnAllProposals",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "callData_", internalType: "bytes", type: "bytes" }],
    name: "hashProposal",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "", internalType: "address[]", type: "address[]" },
      { name: "", internalType: "uint256[]", type: "uint256[]" },
      { name: "callDatas_", internalType: "bytes[]", type: "bytes[]" },
      { name: "", internalType: "bytes32", type: "bytes32" },
    ],
    name: "hashProposal",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "maxTotalZeroRewardPerActiveEpoch",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "epoch", internalType: "uint256", type: "uint256" }],
    name: "numberOfProposalsAt",
    outputs: [{ name: "count", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "voter", internalType: "address", type: "address" },
      { name: "epoch", internalType: "uint256", type: "uint256" },
    ],
    name: "numberOfProposalsVotedOnAt",
    outputs: [{ name: "count", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "proposalDeadline",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "proposalFee",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "proposalProposer",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "proposalSnapshot",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "proposalThreshold",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "proposalVotes",
    outputs: [
      { name: "", internalType: "uint256", type: "uint256" },
      { name: "", internalType: "uint256", type: "uint256" },
      { name: "", internalType: "uint256", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "targets_", internalType: "address[]", type: "address[]" },
      { name: "values_", internalType: "uint256[]", type: "uint256[]" },
      { name: "callDatas_", internalType: "bytes[]", type: "bytes[]" },
      { name: "description_", internalType: "string", type: "string" },
    ],
    name: "propose",
    outputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "quorum",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [],
    name: "registrar",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "list_", internalType: "bytes32", type: "bytes32" },
      { name: "accountToRemove_", internalType: "address", type: "address" },
      { name: "accountToAdd_", internalType: "address", type: "address" },
    ],
    name: "removeFromAndAddToList",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "list_", internalType: "bytes32", type: "bytes32" },
      { name: "account_", internalType: "address", type: "address" },
    ],
    name: "removeFromList",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "sendProposalFeeToVault",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "newCashToken_", internalType: "address", type: "address" },
      { name: "newProposalFee_", internalType: "uint256", type: "uint256" },
    ],
    name: "setCashToken",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "key_", internalType: "bytes32", type: "bytes32" },
      { name: "value_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "setKey",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "newProposalFee_", internalType: "uint256", type: "uint256" },
    ],
    name: "setProposalFee",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "state",
    outputs: [
      { name: "", internalType: "enum IGovernor.ProposalState", type: "uint8" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "token",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "vault",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "voteToken",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "votingDelay",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "votingPeriod",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "zeroGovernor",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "zeroToken",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "cashToken",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "CashTokenSet",
  },
  { type: "event", anonymous: false, inputs: [], name: "EIP712DomainChanged" },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "voter",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "currentEpoch",
        internalType: "uint256",
        type: "uint256",
        indexed: true,
      },
    ],
    name: "HasVotedOnAllProposals",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "proposalId",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "proposer",
        internalType: "address",
        type: "address",
        indexed: false,
      },
      {
        name: "targets",
        internalType: "address[]",
        type: "address[]",
        indexed: false,
      },
      {
        name: "values",
        internalType: "uint256[]",
        type: "uint256[]",
        indexed: false,
      },
      {
        name: "signatures",
        internalType: "string[]",
        type: "string[]",
        indexed: false,
      },
      {
        name: "callDatas",
        internalType: "bytes[]",
        type: "bytes[]",
        indexed: false,
      },
      {
        name: "voteStart",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "voteEnd",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "description",
        internalType: "string",
        type: "string",
        indexed: false,
      },
    ],
    name: "ProposalCreated",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "proposalId",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "ProposalExecuted",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "proposalId",
        internalType: "uint256",
        type: "uint256",
        indexed: true,
      },
      {
        name: "cashToken",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "amount",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "ProposalFeeSentToVault",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "proposalFee",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "ProposalFeeSet",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "voter",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "proposalId",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      { name: "support", internalType: "uint8", type: "uint8", indexed: false },
      {
        name: "weight",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "reason",
        internalType: "string",
        type: "string",
        indexed: false,
      },
    ],
    name: "VoteCast",
  },
  { type: "error", inputs: [], name: "AlreadyVoted" },
  {
    type: "error",
    inputs: [
      { name: "length1", internalType: "uint256", type: "uint256" },
      { name: "length2", internalType: "uint256", type: "uint256" },
    ],
    name: "ArrayLengthMismatch",
  },
  { type: "error", inputs: [], name: "EmptyProposalIdsArray" },
  {
    type: "error",
    inputs: [{ name: "data", internalType: "bytes", type: "bytes" }],
    name: "ExecutionFailed",
  },
  {
    type: "error",
    inputs: [
      {
        name: "state",
        internalType: "enum IGovernor.ProposalState",
        type: "uint8",
      },
    ],
    name: "FeeNotDestinedForVault",
  },
  { type: "error", inputs: [], name: "InvalidCallData" },
  { type: "error", inputs: [], name: "InvalidCallDatasLength" },
  { type: "error", inputs: [], name: "InvalidCashTokenAddress" },
  { type: "error", inputs: [], name: "InvalidEmergencyGovernorAddress" },
  { type: "error", inputs: [], name: "InvalidRegistrarAddress" },
  { type: "error", inputs: [], name: "InvalidSignature" },
  { type: "error", inputs: [], name: "InvalidSignatureLength" },
  { type: "error", inputs: [], name: "InvalidSignatureS" },
  { type: "error", inputs: [], name: "InvalidSignatureV" },
  { type: "error", inputs: [], name: "InvalidTarget" },
  { type: "error", inputs: [], name: "InvalidTargetsLength" },
  { type: "error", inputs: [], name: "InvalidValue" },
  { type: "error", inputs: [], name: "InvalidValuesLength" },
  { type: "error", inputs: [], name: "InvalidVaultAddress" },
  { type: "error", inputs: [], name: "InvalidVoteStart" },
  { type: "error", inputs: [], name: "InvalidVoteTokenAddress" },
  { type: "error", inputs: [], name: "InvalidZeroGovernorAddress" },
  { type: "error", inputs: [], name: "InvalidZeroTokenAddress" },
  { type: "error", inputs: [], name: "NoFeeToSend" },
  { type: "error", inputs: [], name: "NotSelf" },
  { type: "error", inputs: [], name: "NotSelfOrEmergencyGovernor" },
  { type: "error", inputs: [], name: "NotZeroGovernor" },
  { type: "error", inputs: [], name: "ProposalCannotBeExecuted" },
  { type: "error", inputs: [], name: "ProposalDoesNotExist" },
  { type: "error", inputs: [], name: "ProposalExists" },
  {
    type: "error",
    inputs: [
      {
        name: "state",
        internalType: "enum IGovernor.ProposalState",
        type: "uint8",
      },
    ],
    name: "ProposalInactive",
  },
  {
    type: "error",
    inputs: [
      { name: "deadline", internalType: "uint256", type: "uint256" },
      { name: "timestamp", internalType: "uint256", type: "uint256" },
    ],
    name: "SignatureExpired",
  },
  { type: "error", inputs: [], name: "SignerMismatch" },
  { type: "error", inputs: [], name: "TransferFailed" },
  { type: "error", inputs: [], name: "TransferFromFailed" },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ZeroGovernor
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const zeroGovernorAbi = [
  {
    type: "constructor",
    inputs: [
      { name: "voteToken_", internalType: "address", type: "address" },
      {
        name: "emergencyGovernorDeployer_",
        internalType: "address",
        type: "address",
      },
      { name: "powerTokenDeployer_", internalType: "address", type: "address" },
      {
        name: "standardGovernorDeployer_",
        internalType: "address",
        type: "address",
      },
      { name: "bootstrapToken_", internalType: "address", type: "address" },
      {
        name: "standardProposalFee_",
        internalType: "uint256",
        type: "uint256",
      },
      {
        name: "emergencyProposalThresholdRatio_",
        internalType: "uint16",
        type: "uint16",
      },
      {
        name: "zeroProposalThresholdRatio_",
        internalType: "uint16",
        type: "uint16",
      },
      {
        name: "allowedCashTokens_",
        internalType: "address[]",
        type: "address[]",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "BALLOTS_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "BALLOTS_WITH_REASON_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "BALLOT_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "BALLOT_WITH_REASON_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "CLOCK_MODE",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [],
    name: "COUNTING_MODE",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "ONE",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
    ],
    name: "castVote",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
      { name: "v_", internalType: "uint8", type: "uint8" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "s_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "castVoteBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "voter_", internalType: "address", type: "address" },
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "castVoteBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
      { name: "reason_", internalType: "string", type: "string" },
    ],
    name: "castVoteWithReason",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "voter_", internalType: "address", type: "address" },
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
      { name: "reason_", internalType: "string", type: "string" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "castVoteWithReasonBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
      { name: "reason_", internalType: "string", type: "string" },
      { name: "v_", internalType: "uint8", type: "uint8" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "s_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "castVoteWithReasonBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
    ],
    name: "castVotes",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "voter_", internalType: "address", type: "address" },
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "castVotesBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
      { name: "v_", internalType: "uint8", type: "uint8" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "s_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "castVotesBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
      { name: "reasonList_", internalType: "string[]", type: "string[]" },
    ],
    name: "castVotesWithReason",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "voter_", internalType: "address", type: "address" },
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
      { name: "reasonList_", internalType: "string[]", type: "string[]" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "castVotesWithReasonBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
      { name: "reasonList_", internalType: "string[]", type: "string[]" },
      { name: "v_", internalType: "uint8", type: "uint8" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "s_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "castVotesWithReasonBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "clock",
    outputs: [{ name: "", internalType: "uint48", type: "uint48" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "eip712Domain",
    outputs: [
      { name: "fields_", internalType: "bytes1", type: "bytes1" },
      { name: "name_", internalType: "string", type: "string" },
      { name: "version_", internalType: "string", type: "string" },
      { name: "chainId_", internalType: "uint256", type: "uint256" },
      { name: "verifyingContract_", internalType: "address", type: "address" },
      { name: "salt_", internalType: "bytes32", type: "bytes32" },
      { name: "extensions_", internalType: "uint256[]", type: "uint256[]" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "emergencyGovernor",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "emergencyGovernorDeployer",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "", internalType: "address[]", type: "address[]" },
      { name: "", internalType: "uint256[]", type: "uint256[]" },
      { name: "callDatas_", internalType: "bytes[]", type: "bytes[]" },
      { name: "", internalType: "bytes32", type: "bytes32" },
    ],
    name: "execute",
    outputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
    ],
    name: "getBallotDigest",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
      { name: "reason_", internalType: "string", type: "string" },
    ],
    name: "getBallotWithReasonDigest",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
    ],
    name: "getBallotsDigest",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
      { name: "reasonList_", internalType: "string[]", type: "string[]" },
    ],
    name: "getBallotsWithReasonDigest",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "getProposal",
    outputs: [
      { name: "voteStart_", internalType: "uint48", type: "uint48" },
      { name: "voteEnd_", internalType: "uint48", type: "uint48" },
      {
        name: "state_",
        internalType: "enum IGovernor.ProposalState",
        type: "uint8",
      },
      { name: "noVotes_", internalType: "uint256", type: "uint256" },
      { name: "yesVotes_", internalType: "uint256", type: "uint256" },
      { name: "proposer_", internalType: "address", type: "address" },
      { name: "quorum_", internalType: "uint256", type: "uint256" },
      { name: "quorumNumerator_", internalType: "uint16", type: "uint16" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "timepoint_", internalType: "uint256", type: "uint256" },
    ],
    name: "getVotes",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "proposalId", internalType: "uint256", type: "uint256" },
      { name: "voter", internalType: "address", type: "address" },
    ],
    name: "hasVoted",
    outputs: [{ name: "hasVoted", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "callData_", internalType: "bytes", type: "bytes" }],
    name: "hashProposal",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "", internalType: "address[]", type: "address[]" },
      { name: "", internalType: "uint256[]", type: "uint256[]" },
      { name: "callDatas_", internalType: "bytes[]", type: "bytes[]" },
      { name: "", internalType: "bytes32", type: "bytes32" },
    ],
    name: "hashProposal",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "token_", internalType: "address", type: "address" }],
    name: "isAllowedCashToken",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "powerTokenDeployer",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "proposalDeadline",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "proposalProposer",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "proposalId", internalType: "uint256", type: "uint256" }],
    name: "proposalQuorum",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "proposalSnapshot",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "proposalThreshold",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "proposalVotes",
    outputs: [
      { name: "", internalType: "uint256", type: "uint256" },
      { name: "", internalType: "uint256", type: "uint256" },
      { name: "", internalType: "uint256", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "targets_", internalType: "address[]", type: "address[]" },
      { name: "values_", internalType: "uint256[]", type: "uint256[]" },
      { name: "callDatas_", internalType: "bytes[]", type: "bytes[]" },
      { name: "description_", internalType: "string", type: "string" },
    ],
    name: "propose",
    outputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "quorum",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "quorumDenominator",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [],
    name: "quorumNumerator",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "resetToPowerHolders",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "resetToZeroHolders",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "newCashToken_", internalType: "address", type: "address" },
      { name: "newProposalFee_", internalType: "uint256", type: "uint256" },
    ],
    name: "setCashToken",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "newThresholdRatio_", internalType: "uint16", type: "uint16" },
    ],
    name: "setEmergencyProposalThresholdRatio",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "newThresholdRatio_", internalType: "uint16", type: "uint16" },
    ],
    name: "setZeroProposalThresholdRatio",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "standardGovernor",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "standardGovernorDeployer",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "state",
    outputs: [
      {
        name: "state_",
        internalType: "enum IGovernor.ProposalState",
        type: "uint8",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "thresholdRatio",
    outputs: [{ name: "", internalType: "uint16", type: "uint16" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "token",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "voteToken",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "votingDelay",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "votingPeriod",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "allowedCashTokens",
        internalType: "address[]",
        type: "address[]",
        indexed: false,
      },
    ],
    name: "AllowedCashTokensSet",
  },
  { type: "event", anonymous: false, inputs: [], name: "EIP712DomainChanged" },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "proposalId",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "proposer",
        internalType: "address",
        type: "address",
        indexed: false,
      },
      {
        name: "targets",
        internalType: "address[]",
        type: "address[]",
        indexed: false,
      },
      {
        name: "values",
        internalType: "uint256[]",
        type: "uint256[]",
        indexed: false,
      },
      {
        name: "signatures",
        internalType: "string[]",
        type: "string[]",
        indexed: false,
      },
      {
        name: "callDatas",
        internalType: "bytes[]",
        type: "bytes[]",
        indexed: false,
      },
      {
        name: "voteStart",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "voteEnd",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "description",
        internalType: "string",
        type: "string",
        indexed: false,
      },
    ],
    name: "ProposalCreated",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "proposalId",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "ProposalExecuted",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "oldQuorumNumerator",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "newQuorumNumerator",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "QuorumNumeratorUpdated",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "bootstrapToken",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "standardGovernor",
        internalType: "address",
        type: "address",
        indexed: false,
      },
      {
        name: "emergencyGovernor",
        internalType: "address",
        type: "address",
        indexed: false,
      },
      {
        name: "powerToken",
        internalType: "address",
        type: "address",
        indexed: false,
      },
    ],
    name: "ResetExecuted",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "thresholdRatio",
        internalType: "uint16",
        type: "uint16",
        indexed: false,
      },
    ],
    name: "ThresholdRatioSet",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "voter",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "proposalId",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      { name: "support", internalType: "uint8", type: "uint8", indexed: false },
      {
        name: "weight",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "reason",
        internalType: "string",
        type: "string",
        indexed: false,
      },
    ],
    name: "VoteCast",
  },
  { type: "error", inputs: [], name: "AlreadyVoted" },
  {
    type: "error",
    inputs: [
      { name: "length1", internalType: "uint256", type: "uint256" },
      { name: "length2", internalType: "uint256", type: "uint256" },
    ],
    name: "ArrayLengthMismatch",
  },
  { type: "error", inputs: [], name: "EmptyProposalIdsArray" },
  {
    type: "error",
    inputs: [{ name: "data", internalType: "bytes", type: "bytes" }],
    name: "ExecutionFailed",
  },
  { type: "error", inputs: [], name: "InvalidCallData" },
  { type: "error", inputs: [], name: "InvalidCallDatasLength" },
  { type: "error", inputs: [], name: "InvalidCashToken" },
  { type: "error", inputs: [], name: "InvalidCashTokenAddress" },
  {
    type: "error",
    inputs: [],
    name: "InvalidEmergencyGovernorDeployerAddress",
  },
  { type: "error", inputs: [], name: "InvalidPowerTokenDeployerAddress" },
  { type: "error", inputs: [], name: "InvalidSignature" },
  { type: "error", inputs: [], name: "InvalidSignatureLength" },
  { type: "error", inputs: [], name: "InvalidSignatureS" },
  { type: "error", inputs: [], name: "InvalidSignatureV" },
  { type: "error", inputs: [], name: "InvalidStandardGovernorDeployerAddress" },
  { type: "error", inputs: [], name: "InvalidTarget" },
  { type: "error", inputs: [], name: "InvalidTargetsLength" },
  {
    type: "error",
    inputs: [
      { name: "thresholdRatio", internalType: "uint256", type: "uint256" },
      { name: "minThresholdRatio", internalType: "uint256", type: "uint256" },
      { name: "maxThresholdRatio", internalType: "uint256", type: "uint256" },
    ],
    name: "InvalidThresholdRatio",
  },
  { type: "error", inputs: [], name: "InvalidValue" },
  { type: "error", inputs: [], name: "InvalidValuesLength" },
  { type: "error", inputs: [], name: "InvalidVoteStart" },
  { type: "error", inputs: [], name: "InvalidVoteTokenAddress" },
  { type: "error", inputs: [], name: "NoAllowedCashTokens" },
  { type: "error", inputs: [], name: "NotSelf" },
  { type: "error", inputs: [], name: "ProposalCannotBeExecuted" },
  { type: "error", inputs: [], name: "ProposalDoesNotExist" },
  { type: "error", inputs: [], name: "ProposalExists" },
  {
    type: "error",
    inputs: [
      {
        name: "state",
        internalType: "enum IGovernor.ProposalState",
        type: "uint8",
      },
    ],
    name: "ProposalInactive",
  },
  {
    type: "error",
    inputs: [
      { name: "deadline", internalType: "uint256", type: "uint256" },
      { name: "timestamp", internalType: "uint256", type: "uint256" },
    ],
    name: "SignatureExpired",
  },
  { type: "error", inputs: [], name: "SignerMismatch" },
  {
    type: "error",
    inputs: [
      { name: "expected", internalType: "address", type: "address" },
      { name: "deployed", internalType: "address", type: "address" },
    ],
    name: "UnexpectedPowerTokenDeployed",
  },
  {
    type: "error",
    inputs: [
      { name: "expected", internalType: "address", type: "address" },
      { name: "deployed", internalType: "address", type: "address" },
    ],
    name: "UnexpectedStandardGovernorDeployed",
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ZeroToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const zeroTokenAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "standardGovernorDeployer_",
        internalType: "address",
        type: "address",
      },
      {
        name: "initialAccounts_",
        internalType: "address[]",
        type: "address[]",
      },
      {
        name: "initialBalances_",
        internalType: "uint256[]",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "CANCEL_AUTHORIZATION_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "CLOCK_MODE",
    outputs: [{ name: "clockMode_", internalType: "string", type: "string" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [],
    name: "DELEGATION_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "PERMIT_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "RECEIVE_WITH_AUTHORIZATION_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "TRANSFER_WITH_AUTHORIZATION_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "account", internalType: "address", type: "address" },
      { name: "spender", internalType: "address", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "allowance", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "spender_", internalType: "address", type: "address" },
      { name: "amount_", internalType: "uint256", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "success_", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "authorizer", internalType: "address", type: "address" },
      { name: "nonce", internalType: "bytes32", type: "bytes32" },
    ],
    name: "authorizationState",
    outputs: [{ name: "isNonceUsed", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "account_", internalType: "address", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "authorizer_", internalType: "address", type: "address" },
      { name: "nonce_", internalType: "bytes32", type: "bytes32" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "vs_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "cancelAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "authorizer_", internalType: "address", type: "address" },
      { name: "nonce_", internalType: "bytes32", type: "bytes32" },
      { name: "v_", internalType: "uint8", type: "uint8" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "s_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "cancelAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "authorizer_", internalType: "address", type: "address" },
      { name: "nonce_", internalType: "bytes32", type: "bytes32" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "cancelAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "clock",
    outputs: [{ name: "clock_", internalType: "uint48", type: "uint48" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "delegatee_", internalType: "address", type: "address" }],
    name: "delegate",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "delegatee_", internalType: "address", type: "address" },
      { name: "nonce_", internalType: "uint256", type: "uint256" },
      { name: "expiry_", internalType: "uint256", type: "uint256" },
      { name: "v_", internalType: "uint8", type: "uint8" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "s_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "delegateBySig",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "delegatee_", internalType: "address", type: "address" },
      { name: "nonce_", internalType: "uint256", type: "uint256" },
      { name: "expiry_", internalType: "uint256", type: "uint256" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "delegateBySig",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "account_", internalType: "address", type: "address" }],
    name: "delegates",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "eip712Domain",
    outputs: [
      { name: "fields_", internalType: "bytes1", type: "bytes1" },
      { name: "name_", internalType: "string", type: "string" },
      { name: "version_", internalType: "string", type: "string" },
      { name: "chainId_", internalType: "uint256", type: "uint256" },
      { name: "verifyingContract_", internalType: "address", type: "address" },
      { name: "salt_", internalType: "bytes32", type: "bytes32" },
      { name: "extensions_", internalType: "uint256[]", type: "uint256[]" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "delegatee_", internalType: "address", type: "address" },
      { name: "nonce_", internalType: "uint256", type: "uint256" },
      { name: "expiry_", internalType: "uint256", type: "uint256" },
    ],
    name: "getDelegationDigest",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "epoch_", internalType: "uint256", type: "uint256" },
    ],
    name: "getPastVotes",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "account_", internalType: "address", type: "address" }],
    name: "getVotes",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "recipient_", internalType: "address", type: "address" },
      { name: "amount_", internalType: "uint256", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "name_", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "account", internalType: "address", type: "address" }],
    name: "nonces",
    outputs: [{ name: "nonce", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "epoch_", internalType: "uint256", type: "uint256" },
    ],
    name: "pastBalanceOf",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "startEpoch_", internalType: "uint256", type: "uint256" },
      { name: "endEpoch_", internalType: "uint256", type: "uint256" },
    ],
    name: "pastBalancesOf",
    outputs: [{ name: "", internalType: "uint256[]", type: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "epoch_", internalType: "uint256", type: "uint256" },
    ],
    name: "pastDelegates",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "startEpoch_", internalType: "uint256", type: "uint256" },
      { name: "endEpoch_", internalType: "uint256", type: "uint256" },
    ],
    name: "pastTotalSupplies",
    outputs: [{ name: "", internalType: "uint256[]", type: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "epoch_", internalType: "uint256", type: "uint256" }],
    name: "pastTotalSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "owner_", internalType: "address", type: "address" },
      { name: "spender_", internalType: "address", type: "address" },
      { name: "value_", internalType: "uint256", type: "uint256" },
      { name: "deadline_", internalType: "uint256", type: "uint256" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "owner_", internalType: "address", type: "address" },
      { name: "spender_", internalType: "address", type: "address" },
      { name: "value_", internalType: "uint256", type: "uint256" },
      { name: "deadline_", internalType: "uint256", type: "uint256" },
      { name: "v_", internalType: "uint8", type: "uint8" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "s_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "from_", internalType: "address", type: "address" },
      { name: "to_", internalType: "address", type: "address" },
      { name: "value_", internalType: "uint256", type: "uint256" },
      { name: "validAfter_", internalType: "uint256", type: "uint256" },
      { name: "validBefore_", internalType: "uint256", type: "uint256" },
      { name: "nonce_", internalType: "bytes32", type: "bytes32" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "receiveWithAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "from_", internalType: "address", type: "address" },
      { name: "to_", internalType: "address", type: "address" },
      { name: "value_", internalType: "uint256", type: "uint256" },
      { name: "validAfter_", internalType: "uint256", type: "uint256" },
      { name: "validBefore_", internalType: "uint256", type: "uint256" },
      { name: "nonce_", internalType: "bytes32", type: "bytes32" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "vs_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "receiveWithAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "from_", internalType: "address", type: "address" },
      { name: "to_", internalType: "address", type: "address" },
      { name: "value_", internalType: "uint256", type: "uint256" },
      { name: "validAfter_", internalType: "uint256", type: "uint256" },
      { name: "validBefore_", internalType: "uint256", type: "uint256" },
      { name: "nonce_", internalType: "bytes32", type: "bytes32" },
      { name: "v_", internalType: "uint8", type: "uint8" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "s_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "receiveWithAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "standardGovernor",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "standardGovernorDeployer",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "recipient_", internalType: "address", type: "address" },
      { name: "amount_", internalType: "uint256", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "success_", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "sender_", internalType: "address", type: "address" },
      { name: "recipient_", internalType: "address", type: "address" },
      { name: "amount_", internalType: "uint256", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "success_", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "from_", internalType: "address", type: "address" },
      { name: "to_", internalType: "address", type: "address" },
      { name: "value_", internalType: "uint256", type: "uint256" },
      { name: "validAfter_", internalType: "uint256", type: "uint256" },
      { name: "validBefore_", internalType: "uint256", type: "uint256" },
      { name: "nonce_", internalType: "bytes32", type: "bytes32" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "vs_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "transferWithAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "from_", internalType: "address", type: "address" },
      { name: "to_", internalType: "address", type: "address" },
      { name: "value_", internalType: "uint256", type: "uint256" },
      { name: "validAfter_", internalType: "uint256", type: "uint256" },
      { name: "validBefore_", internalType: "uint256", type: "uint256" },
      { name: "nonce_", internalType: "bytes32", type: "bytes32" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "transferWithAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "from_", internalType: "address", type: "address" },
      { name: "to_", internalType: "address", type: "address" },
      { name: "value_", internalType: "uint256", type: "uint256" },
      { name: "validAfter_", internalType: "uint256", type: "uint256" },
      { name: "validBefore_", internalType: "uint256", type: "uint256" },
      { name: "nonce_", internalType: "bytes32", type: "bytes32" },
      { name: "v_", internalType: "uint8", type: "uint8" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "s_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "transferWithAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "account",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "spender",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "amount",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Approval",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "authorizer",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "nonce",
        internalType: "bytes32",
        type: "bytes32",
        indexed: true,
      },
    ],
    name: "AuthorizationCanceled",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "authorizer",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "nonce",
        internalType: "bytes32",
        type: "bytes32",
        indexed: true,
      },
    ],
    name: "AuthorizationUsed",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "delegator",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "fromDelegatee",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "toDelegatee",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "DelegateChanged",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "delegatee",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "previousBalance",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "newBalance",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "DelegateVotesChanged",
  },
  { type: "event", anonymous: false, inputs: [], name: "EIP712DomainChanged" },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "sender",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "recipient",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "amount",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Transfer",
  },
  {
    type: "error",
    inputs: [
      { name: "accountsLength", internalType: "uint256", type: "uint256" },
      { name: "balancesLength", internalType: "uint256", type: "uint256" },
    ],
    name: "ArrayLengthMismatch",
  },
  {
    type: "error",
    inputs: [
      { name: "authorizer", internalType: "address", type: "address" },
      { name: "nonce", internalType: "bytes32", type: "bytes32" },
    ],
    name: "AuthorizationAlreadyUsed",
  },
  {
    type: "error",
    inputs: [
      { name: "timestamp", internalType: "uint256", type: "uint256" },
      { name: "validBefore", internalType: "uint256", type: "uint256" },
    ],
    name: "AuthorizationExpired",
  },
  {
    type: "error",
    inputs: [
      { name: "timestamp", internalType: "uint256", type: "uint256" },
      { name: "validAfter", internalType: "uint256", type: "uint256" },
    ],
    name: "AuthorizationNotYetValid",
  },
  {
    type: "error",
    inputs: [
      { name: "caller", internalType: "address", type: "address" },
      { name: "payee", internalType: "address", type: "address" },
    ],
    name: "CallerMustBePayee",
  },
  { type: "error", inputs: [], name: "EpochZero" },
  {
    type: "error",
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "allowance", internalType: "uint256", type: "uint256" },
      { name: "needed", internalType: "uint256", type: "uint256" },
    ],
    name: "InsufficientAllowance",
  },
  {
    type: "error",
    inputs: [{ name: "amount", internalType: "uint256", type: "uint256" }],
    name: "InsufficientAmount",
  },
  {
    type: "error",
    inputs: [
      { name: "nonce", internalType: "uint256", type: "uint256" },
      { name: "expectedNonce", internalType: "uint256", type: "uint256" },
    ],
    name: "InvalidAccountNonce",
  },
  {
    type: "error",
    inputs: [{ name: "recipient", internalType: "address", type: "address" }],
    name: "InvalidRecipient",
  },
  { type: "error", inputs: [], name: "InvalidSignature" },
  { type: "error", inputs: [], name: "InvalidSignatureLength" },
  { type: "error", inputs: [], name: "InvalidSignatureS" },
  { type: "error", inputs: [], name: "InvalidSignatureV" },
  { type: "error", inputs: [], name: "InvalidStandardGovernorDeployerAddress" },
  { type: "error", inputs: [], name: "InvalidUInt16" },
  { type: "error", inputs: [], name: "InvalidUInt240" },
  {
    type: "error",
    inputs: [
      { name: "timepoint", internalType: "uint48", type: "uint48" },
      { name: "clock", internalType: "uint48", type: "uint48" },
    ],
    name: "NotPastTimepoint",
  },
  { type: "error", inputs: [], name: "NotStandardGovernor" },
  {
    type: "error",
    inputs: [
      { name: "deadline", internalType: "uint256", type: "uint256" },
      { name: "timestamp", internalType: "uint256", type: "uint256" },
    ],
    name: "SignatureExpired",
  },
  { type: "error", inputs: [], name: "SignerMismatch" },
  { type: "error", inputs: [], name: "StartEpochAfterEndEpoch" },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link distributionVaultAbi}__
 */
export const readDistributionVault = /*#__PURE__*/ createReadContract({
  abi: distributionVaultAbi,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link distributionVaultAbi}__ and `functionName` set to `"CLAIM_TYPEHASH"`
 */
export const readDistributionVaultClaimTypehash =
  /*#__PURE__*/ createReadContract({
    abi: distributionVaultAbi,
    functionName: "CLAIM_TYPEHASH",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link distributionVaultAbi}__ and `functionName` set to `"CLOCK_MODE"`
 */
export const readDistributionVaultClockMode = /*#__PURE__*/ createReadContract({
  abi: distributionVaultAbi,
  functionName: "CLOCK_MODE",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link distributionVaultAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const readDistributionVaultDomainSeparator =
  /*#__PURE__*/ createReadContract({
    abi: distributionVaultAbi,
    functionName: "DOMAIN_SEPARATOR",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link distributionVaultAbi}__ and `functionName` set to `"clock"`
 */
export const readDistributionVaultClock = /*#__PURE__*/ createReadContract({
  abi: distributionVaultAbi,
  functionName: "clock",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link distributionVaultAbi}__ and `functionName` set to `"distributionOfAt"`
 */
export const readDistributionVaultDistributionOfAt =
  /*#__PURE__*/ createReadContract({
    abi: distributionVaultAbi,
    functionName: "distributionOfAt",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link distributionVaultAbi}__ and `functionName` set to `"eip712Domain"`
 */
export const readDistributionVaultEip712Domain =
  /*#__PURE__*/ createReadContract({
    abi: distributionVaultAbi,
    functionName: "eip712Domain",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link distributionVaultAbi}__ and `functionName` set to `"getClaimDigest"`
 */
export const readDistributionVaultGetClaimDigest =
  /*#__PURE__*/ createReadContract({
    abi: distributionVaultAbi,
    functionName: "getClaimDigest",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link distributionVaultAbi}__ and `functionName` set to `"getClaimable"`
 */
export const readDistributionVaultGetClaimable =
  /*#__PURE__*/ createReadContract({
    abi: distributionVaultAbi,
    functionName: "getClaimable",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link distributionVaultAbi}__ and `functionName` set to `"getDistributable"`
 */
export const readDistributionVaultGetDistributable =
  /*#__PURE__*/ createReadContract({
    abi: distributionVaultAbi,
    functionName: "getDistributable",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link distributionVaultAbi}__ and `functionName` set to `"hasClaimed"`
 */
export const readDistributionVaultHasClaimed = /*#__PURE__*/ createReadContract(
  { abi: distributionVaultAbi, functionName: "hasClaimed" },
);

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link distributionVaultAbi}__ and `functionName` set to `"name"`
 */
export const readDistributionVaultName = /*#__PURE__*/ createReadContract({
  abi: distributionVaultAbi,
  functionName: "name",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link distributionVaultAbi}__ and `functionName` set to `"nonces"`
 */
export const readDistributionVaultNonces = /*#__PURE__*/ createReadContract({
  abi: distributionVaultAbi,
  functionName: "nonces",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link distributionVaultAbi}__ and `functionName` set to `"zeroToken"`
 */
export const readDistributionVaultZeroToken = /*#__PURE__*/ createReadContract({
  abi: distributionVaultAbi,
  functionName: "zeroToken",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link distributionVaultAbi}__
 */
export const writeDistributionVault = /*#__PURE__*/ createWriteContract({
  abi: distributionVaultAbi,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link distributionVaultAbi}__ and `functionName` set to `"claim"`
 */
export const writeDistributionVaultClaim = /*#__PURE__*/ createWriteContract({
  abi: distributionVaultAbi,
  functionName: "claim",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link distributionVaultAbi}__ and `functionName` set to `"claimBySig"`
 */
export const writeDistributionVaultClaimBySig =
  /*#__PURE__*/ createWriteContract({
    abi: distributionVaultAbi,
    functionName: "claimBySig",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link distributionVaultAbi}__ and `functionName` set to `"distribute"`
 */
export const writeDistributionVaultDistribute =
  /*#__PURE__*/ createWriteContract({
    abi: distributionVaultAbi,
    functionName: "distribute",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link distributionVaultAbi}__
 */
export const simulateDistributionVault = /*#__PURE__*/ createSimulateContract({
  abi: distributionVaultAbi,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link distributionVaultAbi}__ and `functionName` set to `"claim"`
 */
export const simulateDistributionVaultClaim =
  /*#__PURE__*/ createSimulateContract({
    abi: distributionVaultAbi,
    functionName: "claim",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link distributionVaultAbi}__ and `functionName` set to `"claimBySig"`
 */
export const simulateDistributionVaultClaimBySig =
  /*#__PURE__*/ createSimulateContract({
    abi: distributionVaultAbi,
    functionName: "claimBySig",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link distributionVaultAbi}__ and `functionName` set to `"distribute"`
 */
export const simulateDistributionVaultDistribute =
  /*#__PURE__*/ createSimulateContract({
    abi: distributionVaultAbi,
    functionName: "distribute",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link distributionVaultAbi}__
 */
export const watchDistributionVaultEvent =
  /*#__PURE__*/ createWatchContractEvent({ abi: distributionVaultAbi });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link distributionVaultAbi}__ and `eventName` set to `"Claim"`
 */
export const watchDistributionVaultClaimEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: distributionVaultAbi,
    eventName: "Claim",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link distributionVaultAbi}__ and `eventName` set to `"Distribution"`
 */
export const watchDistributionVaultDistributionEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: distributionVaultAbi,
    eventName: "Distribution",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link distributionVaultAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const watchDistributionVaultEip712DomainChangedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: distributionVaultAbi,
    eventName: "EIP712DomainChanged",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__
 */
export const readEmergencyGovernor = /*#__PURE__*/ createReadContract({
  abi: emergencyGovernorAbi,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"BALLOTS_TYPEHASH"`
 */
export const readEmergencyGovernorBallotsTypehash =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "BALLOTS_TYPEHASH",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"BALLOTS_WITH_REASON_TYPEHASH"`
 */
export const readEmergencyGovernorBallotsWithReasonTypehash =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "BALLOTS_WITH_REASON_TYPEHASH",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"BALLOT_TYPEHASH"`
 */
export const readEmergencyGovernorBallotTypehash =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "BALLOT_TYPEHASH",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"BALLOT_WITH_REASON_TYPEHASH"`
 */
export const readEmergencyGovernorBallotWithReasonTypehash =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "BALLOT_WITH_REASON_TYPEHASH",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"CLOCK_MODE"`
 */
export const readEmergencyGovernorClockMode = /*#__PURE__*/ createReadContract({
  abi: emergencyGovernorAbi,
  functionName: "CLOCK_MODE",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"COUNTING_MODE"`
 */
export const readEmergencyGovernorCountingMode =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "COUNTING_MODE",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const readEmergencyGovernorDomainSeparator =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "DOMAIN_SEPARATOR",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"ONE"`
 */
export const readEmergencyGovernorOne = /*#__PURE__*/ createReadContract({
  abi: emergencyGovernorAbi,
  functionName: "ONE",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"clock"`
 */
export const readEmergencyGovernorClock = /*#__PURE__*/ createReadContract({
  abi: emergencyGovernorAbi,
  functionName: "clock",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"eip712Domain"`
 */
export const readEmergencyGovernorEip712Domain =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "eip712Domain",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"getBallotDigest"`
 */
export const readEmergencyGovernorGetBallotDigest =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "getBallotDigest",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"getBallotWithReasonDigest"`
 */
export const readEmergencyGovernorGetBallotWithReasonDigest =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "getBallotWithReasonDigest",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"getBallotsDigest"`
 */
export const readEmergencyGovernorGetBallotsDigest =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "getBallotsDigest",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"getBallotsWithReasonDigest"`
 */
export const readEmergencyGovernorGetBallotsWithReasonDigest =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "getBallotsWithReasonDigest",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"getProposal"`
 */
export const readEmergencyGovernorGetProposal =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "getProposal",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"getVotes"`
 */
export const readEmergencyGovernorGetVotes = /*#__PURE__*/ createReadContract({
  abi: emergencyGovernorAbi,
  functionName: "getVotes",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"hasVoted"`
 */
export const readEmergencyGovernorHasVoted = /*#__PURE__*/ createReadContract({
  abi: emergencyGovernorAbi,
  functionName: "hasVoted",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"hashProposal"`
 */
export const readEmergencyGovernorHashProposal =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "hashProposal",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"name"`
 */
export const readEmergencyGovernorName = /*#__PURE__*/ createReadContract({
  abi: emergencyGovernorAbi,
  functionName: "name",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"proposalDeadline"`
 */
export const readEmergencyGovernorProposalDeadline =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "proposalDeadline",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"proposalProposer"`
 */
export const readEmergencyGovernorProposalProposer =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "proposalProposer",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"proposalQuorum"`
 */
export const readEmergencyGovernorProposalQuorum =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "proposalQuorum",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"proposalSnapshot"`
 */
export const readEmergencyGovernorProposalSnapshot =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "proposalSnapshot",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"proposalThreshold"`
 */
export const readEmergencyGovernorProposalThreshold =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "proposalThreshold",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"proposalVotes"`
 */
export const readEmergencyGovernorProposalVotes =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "proposalVotes",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"quorum"`
 */
export const readEmergencyGovernorQuorum = /*#__PURE__*/ createReadContract({
  abi: emergencyGovernorAbi,
  functionName: "quorum",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"quorumDenominator"`
 */
export const readEmergencyGovernorQuorumDenominator =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "quorumDenominator",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"quorumNumerator"`
 */
export const readEmergencyGovernorQuorumNumerator =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "quorumNumerator",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"registrar"`
 */
export const readEmergencyGovernorRegistrar = /*#__PURE__*/ createReadContract({
  abi: emergencyGovernorAbi,
  functionName: "registrar",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"standardGovernor"`
 */
export const readEmergencyGovernorStandardGovernor =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "standardGovernor",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"state"`
 */
export const readEmergencyGovernorState = /*#__PURE__*/ createReadContract({
  abi: emergencyGovernorAbi,
  functionName: "state",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"thresholdRatio"`
 */
export const readEmergencyGovernorThresholdRatio =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "thresholdRatio",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"token"`
 */
export const readEmergencyGovernorToken = /*#__PURE__*/ createReadContract({
  abi: emergencyGovernorAbi,
  functionName: "token",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"voteToken"`
 */
export const readEmergencyGovernorVoteToken = /*#__PURE__*/ createReadContract({
  abi: emergencyGovernorAbi,
  functionName: "voteToken",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"votingDelay"`
 */
export const readEmergencyGovernorVotingDelay =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "votingDelay",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"votingPeriod"`
 */
export const readEmergencyGovernorVotingPeriod =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "votingPeriod",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"zeroGovernor"`
 */
export const readEmergencyGovernorZeroGovernor =
  /*#__PURE__*/ createReadContract({
    abi: emergencyGovernorAbi,
    functionName: "zeroGovernor",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link emergencyGovernorAbi}__
 */
export const writeEmergencyGovernor = /*#__PURE__*/ createWriteContract({
  abi: emergencyGovernorAbi,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"addToList"`
 */
export const writeEmergencyGovernorAddToList =
  /*#__PURE__*/ createWriteContract({
    abi: emergencyGovernorAbi,
    functionName: "addToList",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"castVote"`
 */
export const writeEmergencyGovernorCastVote = /*#__PURE__*/ createWriteContract(
  { abi: emergencyGovernorAbi, functionName: "castVote" },
);

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"castVoteBySig"`
 */
export const writeEmergencyGovernorCastVoteBySig =
  /*#__PURE__*/ createWriteContract({
    abi: emergencyGovernorAbi,
    functionName: "castVoteBySig",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"castVoteWithReason"`
 */
export const writeEmergencyGovernorCastVoteWithReason =
  /*#__PURE__*/ createWriteContract({
    abi: emergencyGovernorAbi,
    functionName: "castVoteWithReason",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"castVoteWithReasonBySig"`
 */
export const writeEmergencyGovernorCastVoteWithReasonBySig =
  /*#__PURE__*/ createWriteContract({
    abi: emergencyGovernorAbi,
    functionName: "castVoteWithReasonBySig",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"castVotes"`
 */
export const writeEmergencyGovernorCastVotes =
  /*#__PURE__*/ createWriteContract({
    abi: emergencyGovernorAbi,
    functionName: "castVotes",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"castVotesBySig"`
 */
export const writeEmergencyGovernorCastVotesBySig =
  /*#__PURE__*/ createWriteContract({
    abi: emergencyGovernorAbi,
    functionName: "castVotesBySig",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"castVotesWithReason"`
 */
export const writeEmergencyGovernorCastVotesWithReason =
  /*#__PURE__*/ createWriteContract({
    abi: emergencyGovernorAbi,
    functionName: "castVotesWithReason",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"castVotesWithReasonBySig"`
 */
export const writeEmergencyGovernorCastVotesWithReasonBySig =
  /*#__PURE__*/ createWriteContract({
    abi: emergencyGovernorAbi,
    functionName: "castVotesWithReasonBySig",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"execute"`
 */
export const writeEmergencyGovernorExecute = /*#__PURE__*/ createWriteContract({
  abi: emergencyGovernorAbi,
  functionName: "execute",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"propose"`
 */
export const writeEmergencyGovernorPropose = /*#__PURE__*/ createWriteContract({
  abi: emergencyGovernorAbi,
  functionName: "propose",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"removeFromAndAddToList"`
 */
export const writeEmergencyGovernorRemoveFromAndAddToList =
  /*#__PURE__*/ createWriteContract({
    abi: emergencyGovernorAbi,
    functionName: "removeFromAndAddToList",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"removeFromList"`
 */
export const writeEmergencyGovernorRemoveFromList =
  /*#__PURE__*/ createWriteContract({
    abi: emergencyGovernorAbi,
    functionName: "removeFromList",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"setKey"`
 */
export const writeEmergencyGovernorSetKey = /*#__PURE__*/ createWriteContract({
  abi: emergencyGovernorAbi,
  functionName: "setKey",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"setStandardProposalFee"`
 */
export const writeEmergencyGovernorSetStandardProposalFee =
  /*#__PURE__*/ createWriteContract({
    abi: emergencyGovernorAbi,
    functionName: "setStandardProposalFee",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"setThresholdRatio"`
 */
export const writeEmergencyGovernorSetThresholdRatio =
  /*#__PURE__*/ createWriteContract({
    abi: emergencyGovernorAbi,
    functionName: "setThresholdRatio",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link emergencyGovernorAbi}__
 */
export const simulateEmergencyGovernor = /*#__PURE__*/ createSimulateContract({
  abi: emergencyGovernorAbi,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"addToList"`
 */
export const simulateEmergencyGovernorAddToList =
  /*#__PURE__*/ createSimulateContract({
    abi: emergencyGovernorAbi,
    functionName: "addToList",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"castVote"`
 */
export const simulateEmergencyGovernorCastVote =
  /*#__PURE__*/ createSimulateContract({
    abi: emergencyGovernorAbi,
    functionName: "castVote",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"castVoteBySig"`
 */
export const simulateEmergencyGovernorCastVoteBySig =
  /*#__PURE__*/ createSimulateContract({
    abi: emergencyGovernorAbi,
    functionName: "castVoteBySig",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"castVoteWithReason"`
 */
export const simulateEmergencyGovernorCastVoteWithReason =
  /*#__PURE__*/ createSimulateContract({
    abi: emergencyGovernorAbi,
    functionName: "castVoteWithReason",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"castVoteWithReasonBySig"`
 */
export const simulateEmergencyGovernorCastVoteWithReasonBySig =
  /*#__PURE__*/ createSimulateContract({
    abi: emergencyGovernorAbi,
    functionName: "castVoteWithReasonBySig",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"castVotes"`
 */
export const simulateEmergencyGovernorCastVotes =
  /*#__PURE__*/ createSimulateContract({
    abi: emergencyGovernorAbi,
    functionName: "castVotes",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"castVotesBySig"`
 */
export const simulateEmergencyGovernorCastVotesBySig =
  /*#__PURE__*/ createSimulateContract({
    abi: emergencyGovernorAbi,
    functionName: "castVotesBySig",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"castVotesWithReason"`
 */
export const simulateEmergencyGovernorCastVotesWithReason =
  /*#__PURE__*/ createSimulateContract({
    abi: emergencyGovernorAbi,
    functionName: "castVotesWithReason",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"castVotesWithReasonBySig"`
 */
export const simulateEmergencyGovernorCastVotesWithReasonBySig =
  /*#__PURE__*/ createSimulateContract({
    abi: emergencyGovernorAbi,
    functionName: "castVotesWithReasonBySig",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"execute"`
 */
export const simulateEmergencyGovernorExecute =
  /*#__PURE__*/ createSimulateContract({
    abi: emergencyGovernorAbi,
    functionName: "execute",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"propose"`
 */
export const simulateEmergencyGovernorPropose =
  /*#__PURE__*/ createSimulateContract({
    abi: emergencyGovernorAbi,
    functionName: "propose",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"removeFromAndAddToList"`
 */
export const simulateEmergencyGovernorRemoveFromAndAddToList =
  /*#__PURE__*/ createSimulateContract({
    abi: emergencyGovernorAbi,
    functionName: "removeFromAndAddToList",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"removeFromList"`
 */
export const simulateEmergencyGovernorRemoveFromList =
  /*#__PURE__*/ createSimulateContract({
    abi: emergencyGovernorAbi,
    functionName: "removeFromList",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"setKey"`
 */
export const simulateEmergencyGovernorSetKey =
  /*#__PURE__*/ createSimulateContract({
    abi: emergencyGovernorAbi,
    functionName: "setKey",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"setStandardProposalFee"`
 */
export const simulateEmergencyGovernorSetStandardProposalFee =
  /*#__PURE__*/ createSimulateContract({
    abi: emergencyGovernorAbi,
    functionName: "setStandardProposalFee",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `functionName` set to `"setThresholdRatio"`
 */
export const simulateEmergencyGovernorSetThresholdRatio =
  /*#__PURE__*/ createSimulateContract({
    abi: emergencyGovernorAbi,
    functionName: "setThresholdRatio",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link emergencyGovernorAbi}__
 */
export const watchEmergencyGovernorEvent =
  /*#__PURE__*/ createWatchContractEvent({ abi: emergencyGovernorAbi });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const watchEmergencyGovernorEip712DomainChangedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: emergencyGovernorAbi,
    eventName: "EIP712DomainChanged",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `eventName` set to `"ProposalCreated"`
 */
export const watchEmergencyGovernorProposalCreatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: emergencyGovernorAbi,
    eventName: "ProposalCreated",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `eventName` set to `"ProposalExecuted"`
 */
export const watchEmergencyGovernorProposalExecutedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: emergencyGovernorAbi,
    eventName: "ProposalExecuted",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `eventName` set to `"QuorumNumeratorUpdated"`
 */
export const watchEmergencyGovernorQuorumNumeratorUpdatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: emergencyGovernorAbi,
    eventName: "QuorumNumeratorUpdated",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `eventName` set to `"ThresholdRatioSet"`
 */
export const watchEmergencyGovernorThresholdRatioSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: emergencyGovernorAbi,
    eventName: "ThresholdRatioSet",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link emergencyGovernorAbi}__ and `eventName` set to `"VoteCast"`
 */
export const watchEmergencyGovernorVoteCastEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: emergencyGovernorAbi,
    eventName: "VoteCast",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__
 */
export const readPowerToken = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"CANCEL_AUTHORIZATION_TYPEHASH"`
 */
export const readPowerTokenCancelAuthorizationTypehash =
  /*#__PURE__*/ createReadContract({
    abi: powerTokenAbi,
    functionName: "CANCEL_AUTHORIZATION_TYPEHASH",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"CLOCK_MODE"`
 */
export const readPowerTokenClockMode = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "CLOCK_MODE",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"DELEGATION_TYPEHASH"`
 */
export const readPowerTokenDelegationTypehash =
  /*#__PURE__*/ createReadContract({
    abi: powerTokenAbi,
    functionName: "DELEGATION_TYPEHASH",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const readPowerTokenDomainSeparator = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "DOMAIN_SEPARATOR",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"INITIAL_SUPPLY"`
 */
export const readPowerTokenInitialSupply = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "INITIAL_SUPPLY",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"ONE"`
 */
export const readPowerTokenOne = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "ONE",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"PERMIT_TYPEHASH"`
 */
export const readPowerTokenPermitTypehash = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "PERMIT_TYPEHASH",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"RECEIVE_WITH_AUTHORIZATION_TYPEHASH"`
 */
export const readPowerTokenReceiveWithAuthorizationTypehash =
  /*#__PURE__*/ createReadContract({
    abi: powerTokenAbi,
    functionName: "RECEIVE_WITH_AUTHORIZATION_TYPEHASH",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"TRANSFER_WITH_AUTHORIZATION_TYPEHASH"`
 */
export const readPowerTokenTransferWithAuthorizationTypehash =
  /*#__PURE__*/ createReadContract({
    abi: powerTokenAbi,
    functionName: "TRANSFER_WITH_AUTHORIZATION_TYPEHASH",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"allowance"`
 */
export const readPowerTokenAllowance = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "allowance",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"amountToAuction"`
 */
export const readPowerTokenAmountToAuction = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "amountToAuction",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"authorizationState"`
 */
export const readPowerTokenAuthorizationState =
  /*#__PURE__*/ createReadContract({
    abi: powerTokenAbi,
    functionName: "authorizationState",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"balanceOf"`
 */
export const readPowerTokenBalanceOf = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "balanceOf",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"bootstrapEpoch"`
 */
export const readPowerTokenBootstrapEpoch = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "bootstrapEpoch",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"bootstrapToken"`
 */
export const readPowerTokenBootstrapToken = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "bootstrapToken",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"cashToken"`
 */
export const readPowerTokenCashToken = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "cashToken",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"clock"`
 */
export const readPowerTokenClock = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "clock",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"decimals"`
 */
export const readPowerTokenDecimals = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "decimals",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"delegates"`
 */
export const readPowerTokenDelegates = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "delegates",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"eip712Domain"`
 */
export const readPowerTokenEip712Domain = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "eip712Domain",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"getCost"`
 */
export const readPowerTokenGetCost = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "getCost",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"getDelegationDigest"`
 */
export const readPowerTokenGetDelegationDigest =
  /*#__PURE__*/ createReadContract({
    abi: powerTokenAbi,
    functionName: "getDelegationDigest",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"getPastVotes"`
 */
export const readPowerTokenGetPastVotes = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "getPastVotes",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"getVotes"`
 */
export const readPowerTokenGetVotes = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "getVotes",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"hasParticipatedAt"`
 */
export const readPowerTokenHasParticipatedAt = /*#__PURE__*/ createReadContract(
  { abi: powerTokenAbi, functionName: "hasParticipatedAt" },
);

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"name"`
 */
export const readPowerTokenName = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "name",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"nonces"`
 */
export const readPowerTokenNonces = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "nonces",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"participationInflation"`
 */
export const readPowerTokenParticipationInflation =
  /*#__PURE__*/ createReadContract({
    abi: powerTokenAbi,
    functionName: "participationInflation",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"pastBalanceOf"`
 */
export const readPowerTokenPastBalanceOf = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "pastBalanceOf",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"pastDelegates"`
 */
export const readPowerTokenPastDelegates = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "pastDelegates",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"pastTotalSupply"`
 */
export const readPowerTokenPastTotalSupply = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "pastTotalSupply",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"standardGovernor"`
 */
export const readPowerTokenStandardGovernor = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "standardGovernor",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"symbol"`
 */
export const readPowerTokenSymbol = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "symbol",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"targetSupply"`
 */
export const readPowerTokenTargetSupply = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "targetSupply",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"totalSupply"`
 */
export const readPowerTokenTotalSupply = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "totalSupply",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"vault"`
 */
export const readPowerTokenVault = /*#__PURE__*/ createReadContract({
  abi: powerTokenAbi,
  functionName: "vault",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link powerTokenAbi}__
 */
export const writePowerToken = /*#__PURE__*/ createWriteContract({
  abi: powerTokenAbi,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"approve"`
 */
export const writePowerTokenApprove = /*#__PURE__*/ createWriteContract({
  abi: powerTokenAbi,
  functionName: "approve",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"buy"`
 */
export const writePowerTokenBuy = /*#__PURE__*/ createWriteContract({
  abi: powerTokenAbi,
  functionName: "buy",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"cancelAuthorization"`
 */
export const writePowerTokenCancelAuthorization =
  /*#__PURE__*/ createWriteContract({
    abi: powerTokenAbi,
    functionName: "cancelAuthorization",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"delegate"`
 */
export const writePowerTokenDelegate = /*#__PURE__*/ createWriteContract({
  abi: powerTokenAbi,
  functionName: "delegate",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"delegateBySig"`
 */
export const writePowerTokenDelegateBySig = /*#__PURE__*/ createWriteContract({
  abi: powerTokenAbi,
  functionName: "delegateBySig",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"markNextVotingEpochAsActive"`
 */
export const writePowerTokenMarkNextVotingEpochAsActive =
  /*#__PURE__*/ createWriteContract({
    abi: powerTokenAbi,
    functionName: "markNextVotingEpochAsActive",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"markParticipation"`
 */
export const writePowerTokenMarkParticipation =
  /*#__PURE__*/ createWriteContract({
    abi: powerTokenAbi,
    functionName: "markParticipation",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"permit"`
 */
export const writePowerTokenPermit = /*#__PURE__*/ createWriteContract({
  abi: powerTokenAbi,
  functionName: "permit",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"receiveWithAuthorization"`
 */
export const writePowerTokenReceiveWithAuthorization =
  /*#__PURE__*/ createWriteContract({
    abi: powerTokenAbi,
    functionName: "receiveWithAuthorization",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"setNextCashToken"`
 */
export const writePowerTokenSetNextCashToken =
  /*#__PURE__*/ createWriteContract({
    abi: powerTokenAbi,
    functionName: "setNextCashToken",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"sync"`
 */
export const writePowerTokenSync = /*#__PURE__*/ createWriteContract({
  abi: powerTokenAbi,
  functionName: "sync",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const writePowerTokenTransfer = /*#__PURE__*/ createWriteContract({
  abi: powerTokenAbi,
  functionName: "transfer",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const writePowerTokenTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: powerTokenAbi,
  functionName: "transferFrom",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"transferWithAuthorization"`
 */
export const writePowerTokenTransferWithAuthorization =
  /*#__PURE__*/ createWriteContract({
    abi: powerTokenAbi,
    functionName: "transferWithAuthorization",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link powerTokenAbi}__
 */
export const simulatePowerToken = /*#__PURE__*/ createSimulateContract({
  abi: powerTokenAbi,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"approve"`
 */
export const simulatePowerTokenApprove = /*#__PURE__*/ createSimulateContract({
  abi: powerTokenAbi,
  functionName: "approve",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"buy"`
 */
export const simulatePowerTokenBuy = /*#__PURE__*/ createSimulateContract({
  abi: powerTokenAbi,
  functionName: "buy",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"cancelAuthorization"`
 */
export const simulatePowerTokenCancelAuthorization =
  /*#__PURE__*/ createSimulateContract({
    abi: powerTokenAbi,
    functionName: "cancelAuthorization",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"delegate"`
 */
export const simulatePowerTokenDelegate = /*#__PURE__*/ createSimulateContract({
  abi: powerTokenAbi,
  functionName: "delegate",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"delegateBySig"`
 */
export const simulatePowerTokenDelegateBySig =
  /*#__PURE__*/ createSimulateContract({
    abi: powerTokenAbi,
    functionName: "delegateBySig",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"markNextVotingEpochAsActive"`
 */
export const simulatePowerTokenMarkNextVotingEpochAsActive =
  /*#__PURE__*/ createSimulateContract({
    abi: powerTokenAbi,
    functionName: "markNextVotingEpochAsActive",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"markParticipation"`
 */
export const simulatePowerTokenMarkParticipation =
  /*#__PURE__*/ createSimulateContract({
    abi: powerTokenAbi,
    functionName: "markParticipation",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"permit"`
 */
export const simulatePowerTokenPermit = /*#__PURE__*/ createSimulateContract({
  abi: powerTokenAbi,
  functionName: "permit",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"receiveWithAuthorization"`
 */
export const simulatePowerTokenReceiveWithAuthorization =
  /*#__PURE__*/ createSimulateContract({
    abi: powerTokenAbi,
    functionName: "receiveWithAuthorization",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"setNextCashToken"`
 */
export const simulatePowerTokenSetNextCashToken =
  /*#__PURE__*/ createSimulateContract({
    abi: powerTokenAbi,
    functionName: "setNextCashToken",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"sync"`
 */
export const simulatePowerTokenSync = /*#__PURE__*/ createSimulateContract({
  abi: powerTokenAbi,
  functionName: "sync",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const simulatePowerTokenTransfer = /*#__PURE__*/ createSimulateContract({
  abi: powerTokenAbi,
  functionName: "transfer",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const simulatePowerTokenTransferFrom =
  /*#__PURE__*/ createSimulateContract({
    abi: powerTokenAbi,
    functionName: "transferFrom",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link powerTokenAbi}__ and `functionName` set to `"transferWithAuthorization"`
 */
export const simulatePowerTokenTransferWithAuthorization =
  /*#__PURE__*/ createSimulateContract({
    abi: powerTokenAbi,
    functionName: "transferWithAuthorization",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link powerTokenAbi}__
 */
export const watchPowerTokenEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: powerTokenAbi,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link powerTokenAbi}__ and `eventName` set to `"Approval"`
 */
export const watchPowerTokenApprovalEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: powerTokenAbi,
    eventName: "Approval",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link powerTokenAbi}__ and `eventName` set to `"AuthorizationCanceled"`
 */
export const watchPowerTokenAuthorizationCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: powerTokenAbi,
    eventName: "AuthorizationCanceled",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link powerTokenAbi}__ and `eventName` set to `"AuthorizationUsed"`
 */
export const watchPowerTokenAuthorizationUsedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: powerTokenAbi,
    eventName: "AuthorizationUsed",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link powerTokenAbi}__ and `eventName` set to `"Buy"`
 */
export const watchPowerTokenBuyEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: powerTokenAbi,
  eventName: "Buy",
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link powerTokenAbi}__ and `eventName` set to `"DelegateChanged"`
 */
export const watchPowerTokenDelegateChangedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: powerTokenAbi,
    eventName: "DelegateChanged",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link powerTokenAbi}__ and `eventName` set to `"DelegateVotesChanged"`
 */
export const watchPowerTokenDelegateVotesChangedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: powerTokenAbi,
    eventName: "DelegateVotesChanged",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link powerTokenAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const watchPowerTokenEip712DomainChangedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: powerTokenAbi,
    eventName: "EIP712DomainChanged",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link powerTokenAbi}__ and `eventName` set to `"NextCashTokenSet"`
 */
export const watchPowerTokenNextCashTokenSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: powerTokenAbi,
    eventName: "NextCashTokenSet",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link powerTokenAbi}__ and `eventName` set to `"Sync"`
 */
export const watchPowerTokenSyncEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: powerTokenAbi,
  eventName: "Sync",
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link powerTokenAbi}__ and `eventName` set to `"Tagline"`
 */
export const watchPowerTokenTaglineEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: powerTokenAbi,
    eventName: "Tagline",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link powerTokenAbi}__ and `eventName` set to `"TargetSupplyInflated"`
 */
export const watchPowerTokenTargetSupplyInflatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: powerTokenAbi,
    eventName: "TargetSupplyInflated",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link powerTokenAbi}__ and `eventName` set to `"Transfer"`
 */
export const watchPowerTokenTransferEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: powerTokenAbi,
    eventName: "Transfer",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link registrarAbi}__
 */
export const readRegistrar = /*#__PURE__*/ createReadContract({
  abi: registrarAbi,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"CLOCK_MODE"`
 */
export const readRegistrarClockMode = /*#__PURE__*/ createReadContract({
  abi: registrarAbi,
  functionName: "CLOCK_MODE",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"clock"`
 */
export const readRegistrarClock = /*#__PURE__*/ createReadContract({
  abi: registrarAbi,
  functionName: "clock",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"clockPeriod"`
 */
export const readRegistrarClockPeriod = /*#__PURE__*/ createReadContract({
  abi: registrarAbi,
  functionName: "clockPeriod",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"clockStartingTimestamp"`
 */
export const readRegistrarClockStartingTimestamp =
  /*#__PURE__*/ createReadContract({
    abi: registrarAbi,
    functionName: "clockStartingTimestamp",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"emergencyGovernor"`
 */
export const readRegistrarEmergencyGovernor = /*#__PURE__*/ createReadContract({
  abi: registrarAbi,
  functionName: "emergencyGovernor",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"emergencyGovernorDeployer"`
 */
export const readRegistrarEmergencyGovernorDeployer =
  /*#__PURE__*/ createReadContract({
    abi: registrarAbi,
    functionName: "emergencyGovernorDeployer",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"get"`
 */
export const readRegistrarGet = /*#__PURE__*/ createReadContract({
  abi: registrarAbi,
  functionName: "get",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"listContains"`
 */
export const readRegistrarListContains = /*#__PURE__*/ createReadContract({
  abi: registrarAbi,
  functionName: "listContains",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"powerToken"`
 */
export const readRegistrarPowerToken = /*#__PURE__*/ createReadContract({
  abi: registrarAbi,
  functionName: "powerToken",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"powerTokenDeployer"`
 */
export const readRegistrarPowerTokenDeployer = /*#__PURE__*/ createReadContract(
  { abi: registrarAbi, functionName: "powerTokenDeployer" },
);

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"standardGovernor"`
 */
export const readRegistrarStandardGovernor = /*#__PURE__*/ createReadContract({
  abi: registrarAbi,
  functionName: "standardGovernor",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"standardGovernorDeployer"`
 */
export const readRegistrarStandardGovernorDeployer =
  /*#__PURE__*/ createReadContract({
    abi: registrarAbi,
    functionName: "standardGovernorDeployer",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"vault"`
 */
export const readRegistrarVault = /*#__PURE__*/ createReadContract({
  abi: registrarAbi,
  functionName: "vault",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"zeroGovernor"`
 */
export const readRegistrarZeroGovernor = /*#__PURE__*/ createReadContract({
  abi: registrarAbi,
  functionName: "zeroGovernor",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"zeroToken"`
 */
export const readRegistrarZeroToken = /*#__PURE__*/ createReadContract({
  abi: registrarAbi,
  functionName: "zeroToken",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link registrarAbi}__
 */
export const writeRegistrar = /*#__PURE__*/ createWriteContract({
  abi: registrarAbi,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"addToList"`
 */
export const writeRegistrarAddToList = /*#__PURE__*/ createWriteContract({
  abi: registrarAbi,
  functionName: "addToList",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"removeFromList"`
 */
export const writeRegistrarRemoveFromList = /*#__PURE__*/ createWriteContract({
  abi: registrarAbi,
  functionName: "removeFromList",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"setKey"`
 */
export const writeRegistrarSetKey = /*#__PURE__*/ createWriteContract({
  abi: registrarAbi,
  functionName: "setKey",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link registrarAbi}__
 */
export const simulateRegistrar = /*#__PURE__*/ createSimulateContract({
  abi: registrarAbi,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"addToList"`
 */
export const simulateRegistrarAddToList = /*#__PURE__*/ createSimulateContract({
  abi: registrarAbi,
  functionName: "addToList",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"removeFromList"`
 */
export const simulateRegistrarRemoveFromList =
  /*#__PURE__*/ createSimulateContract({
    abi: registrarAbi,
    functionName: "removeFromList",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"setKey"`
 */
export const simulateRegistrarSetKey = /*#__PURE__*/ createSimulateContract({
  abi: registrarAbi,
  functionName: "setKey",
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link registrarAbi}__
 */
export const watchRegistrarEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: registrarAbi,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link registrarAbi}__ and `eventName` set to `"AddressAddedToList"`
 */
export const watchRegistrarAddressAddedToListEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: registrarAbi,
    eventName: "AddressAddedToList",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link registrarAbi}__ and `eventName` set to `"AddressRemovedFromList"`
 */
export const watchRegistrarAddressRemovedFromListEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: registrarAbi,
    eventName: "AddressRemovedFromList",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link registrarAbi}__ and `eventName` set to `"KeySet"`
 */
export const watchRegistrarKeySetEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: registrarAbi, eventName: "KeySet" },
);

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__
 */
export const readStandardGovernor = /*#__PURE__*/ createReadContract({
  abi: standardGovernorAbi,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"BALLOTS_TYPEHASH"`
 */
export const readStandardGovernorBallotsTypehash =
  /*#__PURE__*/ createReadContract({
    abi: standardGovernorAbi,
    functionName: "BALLOTS_TYPEHASH",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"BALLOTS_WITH_REASON_TYPEHASH"`
 */
export const readStandardGovernorBallotsWithReasonTypehash =
  /*#__PURE__*/ createReadContract({
    abi: standardGovernorAbi,
    functionName: "BALLOTS_WITH_REASON_TYPEHASH",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"BALLOT_TYPEHASH"`
 */
export const readStandardGovernorBallotTypehash =
  /*#__PURE__*/ createReadContract({
    abi: standardGovernorAbi,
    functionName: "BALLOT_TYPEHASH",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"BALLOT_WITH_REASON_TYPEHASH"`
 */
export const readStandardGovernorBallotWithReasonTypehash =
  /*#__PURE__*/ createReadContract({
    abi: standardGovernorAbi,
    functionName: "BALLOT_WITH_REASON_TYPEHASH",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"CLOCK_MODE"`
 */
export const readStandardGovernorClockMode = /*#__PURE__*/ createReadContract({
  abi: standardGovernorAbi,
  functionName: "CLOCK_MODE",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"COUNTING_MODE"`
 */
export const readStandardGovernorCountingMode =
  /*#__PURE__*/ createReadContract({
    abi: standardGovernorAbi,
    functionName: "COUNTING_MODE",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const readStandardGovernorDomainSeparator =
  /*#__PURE__*/ createReadContract({
    abi: standardGovernorAbi,
    functionName: "DOMAIN_SEPARATOR",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"cashToken"`
 */
export const readStandardGovernorCashToken = /*#__PURE__*/ createReadContract({
  abi: standardGovernorAbi,
  functionName: "cashToken",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"clock"`
 */
export const readStandardGovernorClock = /*#__PURE__*/ createReadContract({
  abi: standardGovernorAbi,
  functionName: "clock",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"eip712Domain"`
 */
export const readStandardGovernorEip712Domain =
  /*#__PURE__*/ createReadContract({
    abi: standardGovernorAbi,
    functionName: "eip712Domain",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"emergencyGovernor"`
 */
export const readStandardGovernorEmergencyGovernor =
  /*#__PURE__*/ createReadContract({
    abi: standardGovernorAbi,
    functionName: "emergencyGovernor",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"getBallotDigest"`
 */
export const readStandardGovernorGetBallotDigest =
  /*#__PURE__*/ createReadContract({
    abi: standardGovernorAbi,
    functionName: "getBallotDigest",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"getBallotWithReasonDigest"`
 */
export const readStandardGovernorGetBallotWithReasonDigest =
  /*#__PURE__*/ createReadContract({
    abi: standardGovernorAbi,
    functionName: "getBallotWithReasonDigest",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"getBallotsDigest"`
 */
export const readStandardGovernorGetBallotsDigest =
  /*#__PURE__*/ createReadContract({
    abi: standardGovernorAbi,
    functionName: "getBallotsDigest",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"getBallotsWithReasonDigest"`
 */
export const readStandardGovernorGetBallotsWithReasonDigest =
  /*#__PURE__*/ createReadContract({
    abi: standardGovernorAbi,
    functionName: "getBallotsWithReasonDigest",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"getProposal"`
 */
export const readStandardGovernorGetProposal = /*#__PURE__*/ createReadContract(
  { abi: standardGovernorAbi, functionName: "getProposal" },
);

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"getProposalFee"`
 */
export const readStandardGovernorGetProposalFee =
  /*#__PURE__*/ createReadContract({
    abi: standardGovernorAbi,
    functionName: "getProposalFee",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"getVotes"`
 */
export const readStandardGovernorGetVotes = /*#__PURE__*/ createReadContract({
  abi: standardGovernorAbi,
  functionName: "getVotes",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"hasVoted"`
 */
export const readStandardGovernorHasVoted = /*#__PURE__*/ createReadContract({
  abi: standardGovernorAbi,
  functionName: "hasVoted",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"hasVotedOnAllProposals"`
 */
export const readStandardGovernorHasVotedOnAllProposals =
  /*#__PURE__*/ createReadContract({
    abi: standardGovernorAbi,
    functionName: "hasVotedOnAllProposals",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"hashProposal"`
 */
export const readStandardGovernorHashProposal =
  /*#__PURE__*/ createReadContract({
    abi: standardGovernorAbi,
    functionName: "hashProposal",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"maxTotalZeroRewardPerActiveEpoch"`
 */
export const readStandardGovernorMaxTotalZeroRewardPerActiveEpoch =
  /*#__PURE__*/ createReadContract({
    abi: standardGovernorAbi,
    functionName: "maxTotalZeroRewardPerActiveEpoch",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"name"`
 */
export const readStandardGovernorName = /*#__PURE__*/ createReadContract({
  abi: standardGovernorAbi,
  functionName: "name",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"numberOfProposalsAt"`
 */
export const readStandardGovernorNumberOfProposalsAt =
  /*#__PURE__*/ createReadContract({
    abi: standardGovernorAbi,
    functionName: "numberOfProposalsAt",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"numberOfProposalsVotedOnAt"`
 */
export const readStandardGovernorNumberOfProposalsVotedOnAt =
  /*#__PURE__*/ createReadContract({
    abi: standardGovernorAbi,
    functionName: "numberOfProposalsVotedOnAt",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"proposalDeadline"`
 */
export const readStandardGovernorProposalDeadline =
  /*#__PURE__*/ createReadContract({
    abi: standardGovernorAbi,
    functionName: "proposalDeadline",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"proposalFee"`
 */
export const readStandardGovernorProposalFee = /*#__PURE__*/ createReadContract(
  { abi: standardGovernorAbi, functionName: "proposalFee" },
);

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"proposalProposer"`
 */
export const readStandardGovernorProposalProposer =
  /*#__PURE__*/ createReadContract({
    abi: standardGovernorAbi,
    functionName: "proposalProposer",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"proposalSnapshot"`
 */
export const readStandardGovernorProposalSnapshot =
  /*#__PURE__*/ createReadContract({
    abi: standardGovernorAbi,
    functionName: "proposalSnapshot",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"proposalThreshold"`
 */
export const readStandardGovernorProposalThreshold =
  /*#__PURE__*/ createReadContract({
    abi: standardGovernorAbi,
    functionName: "proposalThreshold",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"proposalVotes"`
 */
export const readStandardGovernorProposalVotes =
  /*#__PURE__*/ createReadContract({
    abi: standardGovernorAbi,
    functionName: "proposalVotes",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"quorum"`
 */
export const readStandardGovernorQuorum = /*#__PURE__*/ createReadContract({
  abi: standardGovernorAbi,
  functionName: "quorum",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"registrar"`
 */
export const readStandardGovernorRegistrar = /*#__PURE__*/ createReadContract({
  abi: standardGovernorAbi,
  functionName: "registrar",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"state"`
 */
export const readStandardGovernorState = /*#__PURE__*/ createReadContract({
  abi: standardGovernorAbi,
  functionName: "state",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"token"`
 */
export const readStandardGovernorToken = /*#__PURE__*/ createReadContract({
  abi: standardGovernorAbi,
  functionName: "token",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"vault"`
 */
export const readStandardGovernorVault = /*#__PURE__*/ createReadContract({
  abi: standardGovernorAbi,
  functionName: "vault",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"voteToken"`
 */
export const readStandardGovernorVoteToken = /*#__PURE__*/ createReadContract({
  abi: standardGovernorAbi,
  functionName: "voteToken",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"votingDelay"`
 */
export const readStandardGovernorVotingDelay = /*#__PURE__*/ createReadContract(
  { abi: standardGovernorAbi, functionName: "votingDelay" },
);

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"votingPeriod"`
 */
export const readStandardGovernorVotingPeriod =
  /*#__PURE__*/ createReadContract({
    abi: standardGovernorAbi,
    functionName: "votingPeriod",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"zeroGovernor"`
 */
export const readStandardGovernorZeroGovernor =
  /*#__PURE__*/ createReadContract({
    abi: standardGovernorAbi,
    functionName: "zeroGovernor",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"zeroToken"`
 */
export const readStandardGovernorZeroToken = /*#__PURE__*/ createReadContract({
  abi: standardGovernorAbi,
  functionName: "zeroToken",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link standardGovernorAbi}__
 */
export const writeStandardGovernor = /*#__PURE__*/ createWriteContract({
  abi: standardGovernorAbi,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"addToList"`
 */
export const writeStandardGovernorAddToList = /*#__PURE__*/ createWriteContract(
  { abi: standardGovernorAbi, functionName: "addToList" },
);

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"castVote"`
 */
export const writeStandardGovernorCastVote = /*#__PURE__*/ createWriteContract({
  abi: standardGovernorAbi,
  functionName: "castVote",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"castVoteBySig"`
 */
export const writeStandardGovernorCastVoteBySig =
  /*#__PURE__*/ createWriteContract({
    abi: standardGovernorAbi,
    functionName: "castVoteBySig",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"castVoteWithReason"`
 */
export const writeStandardGovernorCastVoteWithReason =
  /*#__PURE__*/ createWriteContract({
    abi: standardGovernorAbi,
    functionName: "castVoteWithReason",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"castVoteWithReasonBySig"`
 */
export const writeStandardGovernorCastVoteWithReasonBySig =
  /*#__PURE__*/ createWriteContract({
    abi: standardGovernorAbi,
    functionName: "castVoteWithReasonBySig",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"castVotes"`
 */
export const writeStandardGovernorCastVotes = /*#__PURE__*/ createWriteContract(
  { abi: standardGovernorAbi, functionName: "castVotes" },
);

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"castVotesBySig"`
 */
export const writeStandardGovernorCastVotesBySig =
  /*#__PURE__*/ createWriteContract({
    abi: standardGovernorAbi,
    functionName: "castVotesBySig",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"castVotesWithReason"`
 */
export const writeStandardGovernorCastVotesWithReason =
  /*#__PURE__*/ createWriteContract({
    abi: standardGovernorAbi,
    functionName: "castVotesWithReason",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"castVotesWithReasonBySig"`
 */
export const writeStandardGovernorCastVotesWithReasonBySig =
  /*#__PURE__*/ createWriteContract({
    abi: standardGovernorAbi,
    functionName: "castVotesWithReasonBySig",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"execute"`
 */
export const writeStandardGovernorExecute = /*#__PURE__*/ createWriteContract({
  abi: standardGovernorAbi,
  functionName: "execute",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"propose"`
 */
export const writeStandardGovernorPropose = /*#__PURE__*/ createWriteContract({
  abi: standardGovernorAbi,
  functionName: "propose",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"removeFromAndAddToList"`
 */
export const writeStandardGovernorRemoveFromAndAddToList =
  /*#__PURE__*/ createWriteContract({
    abi: standardGovernorAbi,
    functionName: "removeFromAndAddToList",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"removeFromList"`
 */
export const writeStandardGovernorRemoveFromList =
  /*#__PURE__*/ createWriteContract({
    abi: standardGovernorAbi,
    functionName: "removeFromList",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"sendProposalFeeToVault"`
 */
export const writeStandardGovernorSendProposalFeeToVault =
  /*#__PURE__*/ createWriteContract({
    abi: standardGovernorAbi,
    functionName: "sendProposalFeeToVault",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"setCashToken"`
 */
export const writeStandardGovernorSetCashToken =
  /*#__PURE__*/ createWriteContract({
    abi: standardGovernorAbi,
    functionName: "setCashToken",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"setKey"`
 */
export const writeStandardGovernorSetKey = /*#__PURE__*/ createWriteContract({
  abi: standardGovernorAbi,
  functionName: "setKey",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"setProposalFee"`
 */
export const writeStandardGovernorSetProposalFee =
  /*#__PURE__*/ createWriteContract({
    abi: standardGovernorAbi,
    functionName: "setProposalFee",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link standardGovernorAbi}__
 */
export const simulateStandardGovernor = /*#__PURE__*/ createSimulateContract({
  abi: standardGovernorAbi,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"addToList"`
 */
export const simulateStandardGovernorAddToList =
  /*#__PURE__*/ createSimulateContract({
    abi: standardGovernorAbi,
    functionName: "addToList",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"castVote"`
 */
export const simulateStandardGovernorCastVote =
  /*#__PURE__*/ createSimulateContract({
    abi: standardGovernorAbi,
    functionName: "castVote",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"castVoteBySig"`
 */
export const simulateStandardGovernorCastVoteBySig =
  /*#__PURE__*/ createSimulateContract({
    abi: standardGovernorAbi,
    functionName: "castVoteBySig",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"castVoteWithReason"`
 */
export const simulateStandardGovernorCastVoteWithReason =
  /*#__PURE__*/ createSimulateContract({
    abi: standardGovernorAbi,
    functionName: "castVoteWithReason",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"castVoteWithReasonBySig"`
 */
export const simulateStandardGovernorCastVoteWithReasonBySig =
  /*#__PURE__*/ createSimulateContract({
    abi: standardGovernorAbi,
    functionName: "castVoteWithReasonBySig",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"castVotes"`
 */
export const simulateStandardGovernorCastVotes =
  /*#__PURE__*/ createSimulateContract({
    abi: standardGovernorAbi,
    functionName: "castVotes",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"castVotesBySig"`
 */
export const simulateStandardGovernorCastVotesBySig =
  /*#__PURE__*/ createSimulateContract({
    abi: standardGovernorAbi,
    functionName: "castVotesBySig",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"castVotesWithReason"`
 */
export const simulateStandardGovernorCastVotesWithReason =
  /*#__PURE__*/ createSimulateContract({
    abi: standardGovernorAbi,
    functionName: "castVotesWithReason",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"castVotesWithReasonBySig"`
 */
export const simulateStandardGovernorCastVotesWithReasonBySig =
  /*#__PURE__*/ createSimulateContract({
    abi: standardGovernorAbi,
    functionName: "castVotesWithReasonBySig",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"execute"`
 */
export const simulateStandardGovernorExecute =
  /*#__PURE__*/ createSimulateContract({
    abi: standardGovernorAbi,
    functionName: "execute",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"propose"`
 */
export const simulateStandardGovernorPropose =
  /*#__PURE__*/ createSimulateContract({
    abi: standardGovernorAbi,
    functionName: "propose",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"removeFromAndAddToList"`
 */
export const simulateStandardGovernorRemoveFromAndAddToList =
  /*#__PURE__*/ createSimulateContract({
    abi: standardGovernorAbi,
    functionName: "removeFromAndAddToList",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"removeFromList"`
 */
export const simulateStandardGovernorRemoveFromList =
  /*#__PURE__*/ createSimulateContract({
    abi: standardGovernorAbi,
    functionName: "removeFromList",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"sendProposalFeeToVault"`
 */
export const simulateStandardGovernorSendProposalFeeToVault =
  /*#__PURE__*/ createSimulateContract({
    abi: standardGovernorAbi,
    functionName: "sendProposalFeeToVault",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"setCashToken"`
 */
export const simulateStandardGovernorSetCashToken =
  /*#__PURE__*/ createSimulateContract({
    abi: standardGovernorAbi,
    functionName: "setCashToken",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"setKey"`
 */
export const simulateStandardGovernorSetKey =
  /*#__PURE__*/ createSimulateContract({
    abi: standardGovernorAbi,
    functionName: "setKey",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link standardGovernorAbi}__ and `functionName` set to `"setProposalFee"`
 */
export const simulateStandardGovernorSetProposalFee =
  /*#__PURE__*/ createSimulateContract({
    abi: standardGovernorAbi,
    functionName: "setProposalFee",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link standardGovernorAbi}__
 */
export const watchStandardGovernorEvent =
  /*#__PURE__*/ createWatchContractEvent({ abi: standardGovernorAbi });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link standardGovernorAbi}__ and `eventName` set to `"CashTokenSet"`
 */
export const watchStandardGovernorCashTokenSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: standardGovernorAbi,
    eventName: "CashTokenSet",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link standardGovernorAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const watchStandardGovernorEip712DomainChangedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: standardGovernorAbi,
    eventName: "EIP712DomainChanged",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link standardGovernorAbi}__ and `eventName` set to `"HasVotedOnAllProposals"`
 */
export const watchStandardGovernorHasVotedOnAllProposalsEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: standardGovernorAbi,
    eventName: "HasVotedOnAllProposals",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link standardGovernorAbi}__ and `eventName` set to `"ProposalCreated"`
 */
export const watchStandardGovernorProposalCreatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: standardGovernorAbi,
    eventName: "ProposalCreated",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link standardGovernorAbi}__ and `eventName` set to `"ProposalExecuted"`
 */
export const watchStandardGovernorProposalExecutedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: standardGovernorAbi,
    eventName: "ProposalExecuted",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link standardGovernorAbi}__ and `eventName` set to `"ProposalFeeSentToVault"`
 */
export const watchStandardGovernorProposalFeeSentToVaultEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: standardGovernorAbi,
    eventName: "ProposalFeeSentToVault",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link standardGovernorAbi}__ and `eventName` set to `"ProposalFeeSet"`
 */
export const watchStandardGovernorProposalFeeSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: standardGovernorAbi,
    eventName: "ProposalFeeSet",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link standardGovernorAbi}__ and `eventName` set to `"VoteCast"`
 */
export const watchStandardGovernorVoteCastEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: standardGovernorAbi,
    eventName: "VoteCast",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__
 */
export const readZeroGovernor = /*#__PURE__*/ createReadContract({
  abi: zeroGovernorAbi,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"BALLOTS_TYPEHASH"`
 */
export const readZeroGovernorBallotsTypehash = /*#__PURE__*/ createReadContract(
  { abi: zeroGovernorAbi, functionName: "BALLOTS_TYPEHASH" },
);

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"BALLOTS_WITH_REASON_TYPEHASH"`
 */
export const readZeroGovernorBallotsWithReasonTypehash =
  /*#__PURE__*/ createReadContract({
    abi: zeroGovernorAbi,
    functionName: "BALLOTS_WITH_REASON_TYPEHASH",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"BALLOT_TYPEHASH"`
 */
export const readZeroGovernorBallotTypehash = /*#__PURE__*/ createReadContract({
  abi: zeroGovernorAbi,
  functionName: "BALLOT_TYPEHASH",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"BALLOT_WITH_REASON_TYPEHASH"`
 */
export const readZeroGovernorBallotWithReasonTypehash =
  /*#__PURE__*/ createReadContract({
    abi: zeroGovernorAbi,
    functionName: "BALLOT_WITH_REASON_TYPEHASH",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"CLOCK_MODE"`
 */
export const readZeroGovernorClockMode = /*#__PURE__*/ createReadContract({
  abi: zeroGovernorAbi,
  functionName: "CLOCK_MODE",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"COUNTING_MODE"`
 */
export const readZeroGovernorCountingMode = /*#__PURE__*/ createReadContract({
  abi: zeroGovernorAbi,
  functionName: "COUNTING_MODE",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const readZeroGovernorDomainSeparator = /*#__PURE__*/ createReadContract(
  { abi: zeroGovernorAbi, functionName: "DOMAIN_SEPARATOR" },
);

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"ONE"`
 */
export const readZeroGovernorOne = /*#__PURE__*/ createReadContract({
  abi: zeroGovernorAbi,
  functionName: "ONE",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"clock"`
 */
export const readZeroGovernorClock = /*#__PURE__*/ createReadContract({
  abi: zeroGovernorAbi,
  functionName: "clock",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"eip712Domain"`
 */
export const readZeroGovernorEip712Domain = /*#__PURE__*/ createReadContract({
  abi: zeroGovernorAbi,
  functionName: "eip712Domain",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"emergencyGovernor"`
 */
export const readZeroGovernorEmergencyGovernor =
  /*#__PURE__*/ createReadContract({
    abi: zeroGovernorAbi,
    functionName: "emergencyGovernor",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"emergencyGovernorDeployer"`
 */
export const readZeroGovernorEmergencyGovernorDeployer =
  /*#__PURE__*/ createReadContract({
    abi: zeroGovernorAbi,
    functionName: "emergencyGovernorDeployer",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"getBallotDigest"`
 */
export const readZeroGovernorGetBallotDigest = /*#__PURE__*/ createReadContract(
  { abi: zeroGovernorAbi, functionName: "getBallotDigest" },
);

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"getBallotWithReasonDigest"`
 */
export const readZeroGovernorGetBallotWithReasonDigest =
  /*#__PURE__*/ createReadContract({
    abi: zeroGovernorAbi,
    functionName: "getBallotWithReasonDigest",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"getBallotsDigest"`
 */
export const readZeroGovernorGetBallotsDigest =
  /*#__PURE__*/ createReadContract({
    abi: zeroGovernorAbi,
    functionName: "getBallotsDigest",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"getBallotsWithReasonDigest"`
 */
export const readZeroGovernorGetBallotsWithReasonDigest =
  /*#__PURE__*/ createReadContract({
    abi: zeroGovernorAbi,
    functionName: "getBallotsWithReasonDigest",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"getProposal"`
 */
export const readZeroGovernorGetProposal = /*#__PURE__*/ createReadContract({
  abi: zeroGovernorAbi,
  functionName: "getProposal",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"getVotes"`
 */
export const readZeroGovernorGetVotes = /*#__PURE__*/ createReadContract({
  abi: zeroGovernorAbi,
  functionName: "getVotes",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"hasVoted"`
 */
export const readZeroGovernorHasVoted = /*#__PURE__*/ createReadContract({
  abi: zeroGovernorAbi,
  functionName: "hasVoted",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"hashProposal"`
 */
export const readZeroGovernorHashProposal = /*#__PURE__*/ createReadContract({
  abi: zeroGovernorAbi,
  functionName: "hashProposal",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"isAllowedCashToken"`
 */
export const readZeroGovernorIsAllowedCashToken =
  /*#__PURE__*/ createReadContract({
    abi: zeroGovernorAbi,
    functionName: "isAllowedCashToken",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"name"`
 */
export const readZeroGovernorName = /*#__PURE__*/ createReadContract({
  abi: zeroGovernorAbi,
  functionName: "name",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"powerTokenDeployer"`
 */
export const readZeroGovernorPowerTokenDeployer =
  /*#__PURE__*/ createReadContract({
    abi: zeroGovernorAbi,
    functionName: "powerTokenDeployer",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"proposalDeadline"`
 */
export const readZeroGovernorProposalDeadline =
  /*#__PURE__*/ createReadContract({
    abi: zeroGovernorAbi,
    functionName: "proposalDeadline",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"proposalProposer"`
 */
export const readZeroGovernorProposalProposer =
  /*#__PURE__*/ createReadContract({
    abi: zeroGovernorAbi,
    functionName: "proposalProposer",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"proposalQuorum"`
 */
export const readZeroGovernorProposalQuorum = /*#__PURE__*/ createReadContract({
  abi: zeroGovernorAbi,
  functionName: "proposalQuorum",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"proposalSnapshot"`
 */
export const readZeroGovernorProposalSnapshot =
  /*#__PURE__*/ createReadContract({
    abi: zeroGovernorAbi,
    functionName: "proposalSnapshot",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"proposalThreshold"`
 */
export const readZeroGovernorProposalThreshold =
  /*#__PURE__*/ createReadContract({
    abi: zeroGovernorAbi,
    functionName: "proposalThreshold",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"proposalVotes"`
 */
export const readZeroGovernorProposalVotes = /*#__PURE__*/ createReadContract({
  abi: zeroGovernorAbi,
  functionName: "proposalVotes",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"quorum"`
 */
export const readZeroGovernorQuorum = /*#__PURE__*/ createReadContract({
  abi: zeroGovernorAbi,
  functionName: "quorum",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"quorumDenominator"`
 */
export const readZeroGovernorQuorumDenominator =
  /*#__PURE__*/ createReadContract({
    abi: zeroGovernorAbi,
    functionName: "quorumDenominator",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"quorumNumerator"`
 */
export const readZeroGovernorQuorumNumerator = /*#__PURE__*/ createReadContract(
  { abi: zeroGovernorAbi, functionName: "quorumNumerator" },
);

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"standardGovernor"`
 */
export const readZeroGovernorStandardGovernor =
  /*#__PURE__*/ createReadContract({
    abi: zeroGovernorAbi,
    functionName: "standardGovernor",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"standardGovernorDeployer"`
 */
export const readZeroGovernorStandardGovernorDeployer =
  /*#__PURE__*/ createReadContract({
    abi: zeroGovernorAbi,
    functionName: "standardGovernorDeployer",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"state"`
 */
export const readZeroGovernorState = /*#__PURE__*/ createReadContract({
  abi: zeroGovernorAbi,
  functionName: "state",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"thresholdRatio"`
 */
export const readZeroGovernorThresholdRatio = /*#__PURE__*/ createReadContract({
  abi: zeroGovernorAbi,
  functionName: "thresholdRatio",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"token"`
 */
export const readZeroGovernorToken = /*#__PURE__*/ createReadContract({
  abi: zeroGovernorAbi,
  functionName: "token",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"voteToken"`
 */
export const readZeroGovernorVoteToken = /*#__PURE__*/ createReadContract({
  abi: zeroGovernorAbi,
  functionName: "voteToken",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"votingDelay"`
 */
export const readZeroGovernorVotingDelay = /*#__PURE__*/ createReadContract({
  abi: zeroGovernorAbi,
  functionName: "votingDelay",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"votingPeriod"`
 */
export const readZeroGovernorVotingPeriod = /*#__PURE__*/ createReadContract({
  abi: zeroGovernorAbi,
  functionName: "votingPeriod",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroGovernorAbi}__
 */
export const writeZeroGovernor = /*#__PURE__*/ createWriteContract({
  abi: zeroGovernorAbi,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"castVote"`
 */
export const writeZeroGovernorCastVote = /*#__PURE__*/ createWriteContract({
  abi: zeroGovernorAbi,
  functionName: "castVote",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"castVoteBySig"`
 */
export const writeZeroGovernorCastVoteBySig = /*#__PURE__*/ createWriteContract(
  { abi: zeroGovernorAbi, functionName: "castVoteBySig" },
);

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"castVoteWithReason"`
 */
export const writeZeroGovernorCastVoteWithReason =
  /*#__PURE__*/ createWriteContract({
    abi: zeroGovernorAbi,
    functionName: "castVoteWithReason",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"castVoteWithReasonBySig"`
 */
export const writeZeroGovernorCastVoteWithReasonBySig =
  /*#__PURE__*/ createWriteContract({
    abi: zeroGovernorAbi,
    functionName: "castVoteWithReasonBySig",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"castVotes"`
 */
export const writeZeroGovernorCastVotes = /*#__PURE__*/ createWriteContract({
  abi: zeroGovernorAbi,
  functionName: "castVotes",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"castVotesBySig"`
 */
export const writeZeroGovernorCastVotesBySig =
  /*#__PURE__*/ createWriteContract({
    abi: zeroGovernorAbi,
    functionName: "castVotesBySig",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"castVotesWithReason"`
 */
export const writeZeroGovernorCastVotesWithReason =
  /*#__PURE__*/ createWriteContract({
    abi: zeroGovernorAbi,
    functionName: "castVotesWithReason",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"castVotesWithReasonBySig"`
 */
export const writeZeroGovernorCastVotesWithReasonBySig =
  /*#__PURE__*/ createWriteContract({
    abi: zeroGovernorAbi,
    functionName: "castVotesWithReasonBySig",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"execute"`
 */
export const writeZeroGovernorExecute = /*#__PURE__*/ createWriteContract({
  abi: zeroGovernorAbi,
  functionName: "execute",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"propose"`
 */
export const writeZeroGovernorPropose = /*#__PURE__*/ createWriteContract({
  abi: zeroGovernorAbi,
  functionName: "propose",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"resetToPowerHolders"`
 */
export const writeZeroGovernorResetToPowerHolders =
  /*#__PURE__*/ createWriteContract({
    abi: zeroGovernorAbi,
    functionName: "resetToPowerHolders",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"resetToZeroHolders"`
 */
export const writeZeroGovernorResetToZeroHolders =
  /*#__PURE__*/ createWriteContract({
    abi: zeroGovernorAbi,
    functionName: "resetToZeroHolders",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"setCashToken"`
 */
export const writeZeroGovernorSetCashToken = /*#__PURE__*/ createWriteContract({
  abi: zeroGovernorAbi,
  functionName: "setCashToken",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"setEmergencyProposalThresholdRatio"`
 */
export const writeZeroGovernorSetEmergencyProposalThresholdRatio =
  /*#__PURE__*/ createWriteContract({
    abi: zeroGovernorAbi,
    functionName: "setEmergencyProposalThresholdRatio",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"setZeroProposalThresholdRatio"`
 */
export const writeZeroGovernorSetZeroProposalThresholdRatio =
  /*#__PURE__*/ createWriteContract({
    abi: zeroGovernorAbi,
    functionName: "setZeroProposalThresholdRatio",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroGovernorAbi}__
 */
export const simulateZeroGovernor = /*#__PURE__*/ createSimulateContract({
  abi: zeroGovernorAbi,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"castVote"`
 */
export const simulateZeroGovernorCastVote =
  /*#__PURE__*/ createSimulateContract({
    abi: zeroGovernorAbi,
    functionName: "castVote",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"castVoteBySig"`
 */
export const simulateZeroGovernorCastVoteBySig =
  /*#__PURE__*/ createSimulateContract({
    abi: zeroGovernorAbi,
    functionName: "castVoteBySig",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"castVoteWithReason"`
 */
export const simulateZeroGovernorCastVoteWithReason =
  /*#__PURE__*/ createSimulateContract({
    abi: zeroGovernorAbi,
    functionName: "castVoteWithReason",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"castVoteWithReasonBySig"`
 */
export const simulateZeroGovernorCastVoteWithReasonBySig =
  /*#__PURE__*/ createSimulateContract({
    abi: zeroGovernorAbi,
    functionName: "castVoteWithReasonBySig",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"castVotes"`
 */
export const simulateZeroGovernorCastVotes =
  /*#__PURE__*/ createSimulateContract({
    abi: zeroGovernorAbi,
    functionName: "castVotes",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"castVotesBySig"`
 */
export const simulateZeroGovernorCastVotesBySig =
  /*#__PURE__*/ createSimulateContract({
    abi: zeroGovernorAbi,
    functionName: "castVotesBySig",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"castVotesWithReason"`
 */
export const simulateZeroGovernorCastVotesWithReason =
  /*#__PURE__*/ createSimulateContract({
    abi: zeroGovernorAbi,
    functionName: "castVotesWithReason",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"castVotesWithReasonBySig"`
 */
export const simulateZeroGovernorCastVotesWithReasonBySig =
  /*#__PURE__*/ createSimulateContract({
    abi: zeroGovernorAbi,
    functionName: "castVotesWithReasonBySig",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"execute"`
 */
export const simulateZeroGovernorExecute = /*#__PURE__*/ createSimulateContract(
  { abi: zeroGovernorAbi, functionName: "execute" },
);

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"propose"`
 */
export const simulateZeroGovernorPropose = /*#__PURE__*/ createSimulateContract(
  { abi: zeroGovernorAbi, functionName: "propose" },
);

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"resetToPowerHolders"`
 */
export const simulateZeroGovernorResetToPowerHolders =
  /*#__PURE__*/ createSimulateContract({
    abi: zeroGovernorAbi,
    functionName: "resetToPowerHolders",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"resetToZeroHolders"`
 */
export const simulateZeroGovernorResetToZeroHolders =
  /*#__PURE__*/ createSimulateContract({
    abi: zeroGovernorAbi,
    functionName: "resetToZeroHolders",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"setCashToken"`
 */
export const simulateZeroGovernorSetCashToken =
  /*#__PURE__*/ createSimulateContract({
    abi: zeroGovernorAbi,
    functionName: "setCashToken",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"setEmergencyProposalThresholdRatio"`
 */
export const simulateZeroGovernorSetEmergencyProposalThresholdRatio =
  /*#__PURE__*/ createSimulateContract({
    abi: zeroGovernorAbi,
    functionName: "setEmergencyProposalThresholdRatio",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroGovernorAbi}__ and `functionName` set to `"setZeroProposalThresholdRatio"`
 */
export const simulateZeroGovernorSetZeroProposalThresholdRatio =
  /*#__PURE__*/ createSimulateContract({
    abi: zeroGovernorAbi,
    functionName: "setZeroProposalThresholdRatio",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link zeroGovernorAbi}__
 */
export const watchZeroGovernorEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: zeroGovernorAbi,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link zeroGovernorAbi}__ and `eventName` set to `"AllowedCashTokensSet"`
 */
export const watchZeroGovernorAllowedCashTokensSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: zeroGovernorAbi,
    eventName: "AllowedCashTokensSet",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link zeroGovernorAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const watchZeroGovernorEip712DomainChangedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: zeroGovernorAbi,
    eventName: "EIP712DomainChanged",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link zeroGovernorAbi}__ and `eventName` set to `"ProposalCreated"`
 */
export const watchZeroGovernorProposalCreatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: zeroGovernorAbi,
    eventName: "ProposalCreated",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link zeroGovernorAbi}__ and `eventName` set to `"ProposalExecuted"`
 */
export const watchZeroGovernorProposalExecutedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: zeroGovernorAbi,
    eventName: "ProposalExecuted",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link zeroGovernorAbi}__ and `eventName` set to `"QuorumNumeratorUpdated"`
 */
export const watchZeroGovernorQuorumNumeratorUpdatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: zeroGovernorAbi,
    eventName: "QuorumNumeratorUpdated",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link zeroGovernorAbi}__ and `eventName` set to `"ResetExecuted"`
 */
export const watchZeroGovernorResetExecutedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: zeroGovernorAbi,
    eventName: "ResetExecuted",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link zeroGovernorAbi}__ and `eventName` set to `"ThresholdRatioSet"`
 */
export const watchZeroGovernorThresholdRatioSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: zeroGovernorAbi,
    eventName: "ThresholdRatioSet",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link zeroGovernorAbi}__ and `eventName` set to `"VoteCast"`
 */
export const watchZeroGovernorVoteCastEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: zeroGovernorAbi,
    eventName: "VoteCast",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__
 */
export const readZeroToken = /*#__PURE__*/ createReadContract({
  abi: zeroTokenAbi,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"CANCEL_AUTHORIZATION_TYPEHASH"`
 */
export const readZeroTokenCancelAuthorizationTypehash =
  /*#__PURE__*/ createReadContract({
    abi: zeroTokenAbi,
    functionName: "CANCEL_AUTHORIZATION_TYPEHASH",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"CLOCK_MODE"`
 */
export const readZeroTokenClockMode = /*#__PURE__*/ createReadContract({
  abi: zeroTokenAbi,
  functionName: "CLOCK_MODE",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"DELEGATION_TYPEHASH"`
 */
export const readZeroTokenDelegationTypehash = /*#__PURE__*/ createReadContract(
  { abi: zeroTokenAbi, functionName: "DELEGATION_TYPEHASH" },
);

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const readZeroTokenDomainSeparator = /*#__PURE__*/ createReadContract({
  abi: zeroTokenAbi,
  functionName: "DOMAIN_SEPARATOR",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"PERMIT_TYPEHASH"`
 */
export const readZeroTokenPermitTypehash = /*#__PURE__*/ createReadContract({
  abi: zeroTokenAbi,
  functionName: "PERMIT_TYPEHASH",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"RECEIVE_WITH_AUTHORIZATION_TYPEHASH"`
 */
export const readZeroTokenReceiveWithAuthorizationTypehash =
  /*#__PURE__*/ createReadContract({
    abi: zeroTokenAbi,
    functionName: "RECEIVE_WITH_AUTHORIZATION_TYPEHASH",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"TRANSFER_WITH_AUTHORIZATION_TYPEHASH"`
 */
export const readZeroTokenTransferWithAuthorizationTypehash =
  /*#__PURE__*/ createReadContract({
    abi: zeroTokenAbi,
    functionName: "TRANSFER_WITH_AUTHORIZATION_TYPEHASH",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"allowance"`
 */
export const readZeroTokenAllowance = /*#__PURE__*/ createReadContract({
  abi: zeroTokenAbi,
  functionName: "allowance",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"authorizationState"`
 */
export const readZeroTokenAuthorizationState = /*#__PURE__*/ createReadContract(
  { abi: zeroTokenAbi, functionName: "authorizationState" },
);

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"balanceOf"`
 */
export const readZeroTokenBalanceOf = /*#__PURE__*/ createReadContract({
  abi: zeroTokenAbi,
  functionName: "balanceOf",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"clock"`
 */
export const readZeroTokenClock = /*#__PURE__*/ createReadContract({
  abi: zeroTokenAbi,
  functionName: "clock",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"decimals"`
 */
export const readZeroTokenDecimals = /*#__PURE__*/ createReadContract({
  abi: zeroTokenAbi,
  functionName: "decimals",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"delegates"`
 */
export const readZeroTokenDelegates = /*#__PURE__*/ createReadContract({
  abi: zeroTokenAbi,
  functionName: "delegates",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"eip712Domain"`
 */
export const readZeroTokenEip712Domain = /*#__PURE__*/ createReadContract({
  abi: zeroTokenAbi,
  functionName: "eip712Domain",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"getDelegationDigest"`
 */
export const readZeroTokenGetDelegationDigest =
  /*#__PURE__*/ createReadContract({
    abi: zeroTokenAbi,
    functionName: "getDelegationDigest",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"getPastVotes"`
 */
export const readZeroTokenGetPastVotes = /*#__PURE__*/ createReadContract({
  abi: zeroTokenAbi,
  functionName: "getPastVotes",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"getVotes"`
 */
export const readZeroTokenGetVotes = /*#__PURE__*/ createReadContract({
  abi: zeroTokenAbi,
  functionName: "getVotes",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"name"`
 */
export const readZeroTokenName = /*#__PURE__*/ createReadContract({
  abi: zeroTokenAbi,
  functionName: "name",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"nonces"`
 */
export const readZeroTokenNonces = /*#__PURE__*/ createReadContract({
  abi: zeroTokenAbi,
  functionName: "nonces",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"pastBalanceOf"`
 */
export const readZeroTokenPastBalanceOf = /*#__PURE__*/ createReadContract({
  abi: zeroTokenAbi,
  functionName: "pastBalanceOf",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"pastBalancesOf"`
 */
export const readZeroTokenPastBalancesOf = /*#__PURE__*/ createReadContract({
  abi: zeroTokenAbi,
  functionName: "pastBalancesOf",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"pastDelegates"`
 */
export const readZeroTokenPastDelegates = /*#__PURE__*/ createReadContract({
  abi: zeroTokenAbi,
  functionName: "pastDelegates",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"pastTotalSupplies"`
 */
export const readZeroTokenPastTotalSupplies = /*#__PURE__*/ createReadContract({
  abi: zeroTokenAbi,
  functionName: "pastTotalSupplies",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"pastTotalSupply"`
 */
export const readZeroTokenPastTotalSupply = /*#__PURE__*/ createReadContract({
  abi: zeroTokenAbi,
  functionName: "pastTotalSupply",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"standardGovernor"`
 */
export const readZeroTokenStandardGovernor = /*#__PURE__*/ createReadContract({
  abi: zeroTokenAbi,
  functionName: "standardGovernor",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"standardGovernorDeployer"`
 */
export const readZeroTokenStandardGovernorDeployer =
  /*#__PURE__*/ createReadContract({
    abi: zeroTokenAbi,
    functionName: "standardGovernorDeployer",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"symbol"`
 */
export const readZeroTokenSymbol = /*#__PURE__*/ createReadContract({
  abi: zeroTokenAbi,
  functionName: "symbol",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"totalSupply"`
 */
export const readZeroTokenTotalSupply = /*#__PURE__*/ createReadContract({
  abi: zeroTokenAbi,
  functionName: "totalSupply",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroTokenAbi}__
 */
export const writeZeroToken = /*#__PURE__*/ createWriteContract({
  abi: zeroTokenAbi,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"approve"`
 */
export const writeZeroTokenApprove = /*#__PURE__*/ createWriteContract({
  abi: zeroTokenAbi,
  functionName: "approve",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"cancelAuthorization"`
 */
export const writeZeroTokenCancelAuthorization =
  /*#__PURE__*/ createWriteContract({
    abi: zeroTokenAbi,
    functionName: "cancelAuthorization",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"delegate"`
 */
export const writeZeroTokenDelegate = /*#__PURE__*/ createWriteContract({
  abi: zeroTokenAbi,
  functionName: "delegate",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"delegateBySig"`
 */
export const writeZeroTokenDelegateBySig = /*#__PURE__*/ createWriteContract({
  abi: zeroTokenAbi,
  functionName: "delegateBySig",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"mint"`
 */
export const writeZeroTokenMint = /*#__PURE__*/ createWriteContract({
  abi: zeroTokenAbi,
  functionName: "mint",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"permit"`
 */
export const writeZeroTokenPermit = /*#__PURE__*/ createWriteContract({
  abi: zeroTokenAbi,
  functionName: "permit",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"receiveWithAuthorization"`
 */
export const writeZeroTokenReceiveWithAuthorization =
  /*#__PURE__*/ createWriteContract({
    abi: zeroTokenAbi,
    functionName: "receiveWithAuthorization",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const writeZeroTokenTransfer = /*#__PURE__*/ createWriteContract({
  abi: zeroTokenAbi,
  functionName: "transfer",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const writeZeroTokenTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: zeroTokenAbi,
  functionName: "transferFrom",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"transferWithAuthorization"`
 */
export const writeZeroTokenTransferWithAuthorization =
  /*#__PURE__*/ createWriteContract({
    abi: zeroTokenAbi,
    functionName: "transferWithAuthorization",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroTokenAbi}__
 */
export const simulateZeroToken = /*#__PURE__*/ createSimulateContract({
  abi: zeroTokenAbi,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"approve"`
 */
export const simulateZeroTokenApprove = /*#__PURE__*/ createSimulateContract({
  abi: zeroTokenAbi,
  functionName: "approve",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"cancelAuthorization"`
 */
export const simulateZeroTokenCancelAuthorization =
  /*#__PURE__*/ createSimulateContract({
    abi: zeroTokenAbi,
    functionName: "cancelAuthorization",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"delegate"`
 */
export const simulateZeroTokenDelegate = /*#__PURE__*/ createSimulateContract({
  abi: zeroTokenAbi,
  functionName: "delegate",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"delegateBySig"`
 */
export const simulateZeroTokenDelegateBySig =
  /*#__PURE__*/ createSimulateContract({
    abi: zeroTokenAbi,
    functionName: "delegateBySig",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"mint"`
 */
export const simulateZeroTokenMint = /*#__PURE__*/ createSimulateContract({
  abi: zeroTokenAbi,
  functionName: "mint",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"permit"`
 */
export const simulateZeroTokenPermit = /*#__PURE__*/ createSimulateContract({
  abi: zeroTokenAbi,
  functionName: "permit",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"receiveWithAuthorization"`
 */
export const simulateZeroTokenReceiveWithAuthorization =
  /*#__PURE__*/ createSimulateContract({
    abi: zeroTokenAbi,
    functionName: "receiveWithAuthorization",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const simulateZeroTokenTransfer = /*#__PURE__*/ createSimulateContract({
  abi: zeroTokenAbi,
  functionName: "transfer",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateZeroTokenTransferFrom =
  /*#__PURE__*/ createSimulateContract({
    abi: zeroTokenAbi,
    functionName: "transferFrom",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link zeroTokenAbi}__ and `functionName` set to `"transferWithAuthorization"`
 */
export const simulateZeroTokenTransferWithAuthorization =
  /*#__PURE__*/ createSimulateContract({
    abi: zeroTokenAbi,
    functionName: "transferWithAuthorization",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link zeroTokenAbi}__
 */
export const watchZeroTokenEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: zeroTokenAbi,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link zeroTokenAbi}__ and `eventName` set to `"Approval"`
 */
export const watchZeroTokenApprovalEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: zeroTokenAbi,
    eventName: "Approval",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link zeroTokenAbi}__ and `eventName` set to `"AuthorizationCanceled"`
 */
export const watchZeroTokenAuthorizationCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: zeroTokenAbi,
    eventName: "AuthorizationCanceled",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link zeroTokenAbi}__ and `eventName` set to `"AuthorizationUsed"`
 */
export const watchZeroTokenAuthorizationUsedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: zeroTokenAbi,
    eventName: "AuthorizationUsed",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link zeroTokenAbi}__ and `eventName` set to `"DelegateChanged"`
 */
export const watchZeroTokenDelegateChangedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: zeroTokenAbi,
    eventName: "DelegateChanged",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link zeroTokenAbi}__ and `eventName` set to `"DelegateVotesChanged"`
 */
export const watchZeroTokenDelegateVotesChangedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: zeroTokenAbi,
    eventName: "DelegateVotesChanged",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link zeroTokenAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const watchZeroTokenEip712DomainChangedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: zeroTokenAbi,
    eventName: "EIP712DomainChanged",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link zeroTokenAbi}__ and `eventName` set to `"Transfer"`
 */
export const watchZeroTokenTransferEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: zeroTokenAbi,
    eventName: "Transfer",
  });
