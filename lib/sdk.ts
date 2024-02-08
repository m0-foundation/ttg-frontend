import {
  getContract,
  GetContractArgs,
  readContract,
  ReadContractConfig,
  writeContract,
  WriteContractArgs,
  WriteContractPreparedArgs,
  WriteContractUnpreparedArgs,
  prepareWriteContract,
  PrepareWriteContractConfig,
  watchContractEvent,
  WatchContractEventConfig,
  WatchContractEventCallback,
} from "@wagmi/core";

/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DistributionVault
/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const distributionVaultABI = [
  {
    stateMutability: "nonpayable",
    type: "constructor",
    inputs: [{ name: "zeroToken_", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "CLAIM_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "pure",
    type: "function",
    inputs: [],
    name: "CLOCK_MODE",
    outputs: [{ name: "", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "token_", internalType: "address", type: "address" },
      { name: "startEpoch_", internalType: "uint256", type: "uint256" },
      { name: "endEpoch_", internalType: "uint256", type: "uint256" },
      { name: "destination_", internalType: "address", type: "address" },
    ],
    name: "claim",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "clock",
    outputs: [{ name: "", internalType: "uint48", type: "uint48" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "token_", internalType: "address", type: "address" }],
    name: "distribute",
    outputs: [{ name: "amount_", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "token", internalType: "address", type: "address" },
      { name: "epoch", internalType: "uint256", type: "uint256" },
    ],
    name: "distributionOfAt",
    outputs: [{ name: "amount", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "token_", internalType: "address", type: "address" },
      { name: "startEpoch_", internalType: "uint256", type: "uint256" },
      { name: "endEpoch_", internalType: "uint256", type: "uint256" },
      { name: "destination_", internalType: "address", type: "address" },
      { name: "nonce_", internalType: "uint256", type: "uint256" },
      { name: "deadline_", internalType: "uint256", type: "uint256" },
    ],
    name: "getClaimDigest",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "token_", internalType: "address", type: "address" },
      { name: "account_", internalType: "address", type: "address" },
      { name: "startEpoch_", internalType: "uint256", type: "uint256" },
      { name: "endEpoch_", internalType: "uint256", type: "uint256" },
    ],
    name: "getClaimable",
    outputs: [{ name: "claimable_", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "token", internalType: "address", type: "address" },
      { name: "epoch", internalType: "uint256", type: "uint256" },
      { name: "account", internalType: "address", type: "address" },
    ],
    name: "hasClaimed",
    outputs: [{ name: "claimed", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "account", internalType: "address", type: "address" }],
    name: "nonces",
    outputs: [{ name: "nonce", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "zeroToken",
    outputs: [{ name: "", internalType: "address", type: "address" }],
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
  { type: "error", inputs: [], name: "InvalidSignature" },
  { type: "error", inputs: [], name: "InvalidSignatureLength" },
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
      { name: "nonce", internalType: "uint256", type: "uint256" },
      { name: "expectedNonce", internalType: "uint256", type: "uint256" },
    ],
    name: "ReusedNonce",
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
] as const;

/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EmergencyGovernor
/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const emergencyGovernorABI = [
  {
    stateMutability: "nonpayable",
    type: "constructor",
    inputs: [
      { name: "voteToken_", internalType: "address", type: "address" },
      { name: "zeroGovernor_", internalType: "address", type: "address" },
      { name: "registrar_", internalType: "address", type: "address" },
      { name: "standardGovernor_", internalType: "address", type: "address" },
      { name: "thresholdRatio_", internalType: "uint16", type: "uint16" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "BALLOTS_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "BALLOT_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "pure",
    type: "function",
    inputs: [],
    name: "CLOCK_MODE",
    outputs: [{ name: "", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "pure",
    type: "function",
    inputs: [],
    name: "COUNTING_MODE",
    outputs: [{ name: "", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "ONE",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "list_", internalType: "bytes32", type: "bytes32" },
      { name: "account_", internalType: "address", type: "address" },
    ],
    name: "addToList",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
    ],
    name: "castVote",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "voter_", internalType: "address", type: "address" },
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "castVoteBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
      { name: "", internalType: "string", type: "string" },
    ],
    name: "castVoteWithReason",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
    ],
    name: "castVotes",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "voter_", internalType: "address", type: "address" },
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "castVotesBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "clock",
    outputs: [{ name: "", internalType: "uint48", type: "uint48" }],
  },
  {
    stateMutability: "payable",
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
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
    ],
    name: "getBallotDigest",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
    ],
    name: "getBallotsDigest",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
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
      { name: "thresholdRatio_", internalType: "uint16", type: "uint16" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "timepoint_", internalType: "uint256", type: "uint256" },
    ],
    name: "getVotes",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "proposalId", internalType: "uint256", type: "uint256" },
      { name: "voter", internalType: "address", type: "address" },
    ],
    name: "hasVoted",
    outputs: [{ name: "hasVoted", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "callData_", internalType: "bytes", type: "bytes" }],
    name: "hashProposal",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "", internalType: "address[]", type: "address[]" },
      { name: "", internalType: "uint256[]", type: "uint256[]" },
      { name: "callDatas_", internalType: "bytes[]", type: "bytes[]" },
      { name: "", internalType: "bytes32", type: "bytes32" },
    ],
    name: "hashProposal",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "proposalDeadline",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "proposalProposer",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "proposalSnapshot",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "pure",
    type: "function",
    inputs: [],
    name: "proposalThreshold",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "quorum",
    outputs: [{ name: "quorum_", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "timepoint_", internalType: "uint256", type: "uint256" }],
    name: "quorum",
    outputs: [{ name: "quorum_", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "registrar",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "list_", internalType: "bytes32", type: "bytes32" },
      { name: "accountToRemove_", internalType: "address", type: "address" },
      { name: "accountToAdd_", internalType: "address", type: "address" },
    ],
    name: "removeFromAndAddToList",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "list_", internalType: "bytes32", type: "bytes32" },
      { name: "account_", internalType: "address", type: "address" },
    ],
    name: "removeFromList",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "key_", internalType: "bytes32", type: "bytes32" },
      { name: "value_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "setKey",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "newProposalFee_", internalType: "uint256", type: "uint256" },
    ],
    name: "setStandardProposalFee",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "newThresholdRatio_", internalType: "uint16", type: "uint16" },
    ],
    name: "setThresholdRatio",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "standardGovernor",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
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
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "thresholdRatio",
    outputs: [{ name: "", internalType: "uint16", type: "uint16" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "voteToken",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "votingDelay",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "votingPeriod",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "zeroGovernor",
    outputs: [{ name: "", internalType: "address", type: "address" }],
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
    inputs: [{ name: "data", internalType: "bytes", type: "bytes" }],
    name: "ExecutionFailed",
  },
  { type: "error", inputs: [], name: "InvalidCallData" },
  { type: "error", inputs: [], name: "InvalidCallDatasLength" },
  { type: "error", inputs: [], name: "InvalidEpoch" },
  { type: "error", inputs: [], name: "InvalidRegistrarAddress" },
  { type: "error", inputs: [], name: "InvalidSignature" },
  { type: "error", inputs: [], name: "InvalidSignatureLength" },
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
  { type: "error", inputs: [], name: "InvalidUInt16" },
  { type: "error", inputs: [], name: "InvalidValue" },
  { type: "error", inputs: [], name: "InvalidValuesLength" },
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
    name: "ProposalNotActive",
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

/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PowerToken
/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const powerTokenABI = [
  {
    stateMutability: "nonpayable",
    type: "constructor",
    inputs: [
      { name: "bootstrapToken_", internalType: "address", type: "address" },
      { name: "standardGovernor_", internalType: "address", type: "address" },
      { name: "cashToken_", internalType: "address", type: "address" },
      { name: "vault_", internalType: "address", type: "address" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "CANCEL_AUTHORIZATION_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "pure",
    type: "function",
    inputs: [],
    name: "CLOCK_MODE",
    outputs: [{ name: "clockMode_", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "DELEGATION_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "INITIAL_SUPPLY",
    outputs: [{ name: "", internalType: "uint240", type: "uint240" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "ONE",
    outputs: [{ name: "", internalType: "uint16", type: "uint16" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "PERMIT_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "RECEIVE_WITH_AUTHORIZATION_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "TRANSFER_WITH_AUTHORIZATION_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "account", internalType: "address", type: "address" },
      { name: "spender", internalType: "address", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "allowance", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "amountToAuction",
    outputs: [{ name: "", internalType: "uint240", type: "uint240" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "spender_", internalType: "address", type: "address" },
      { name: "amount_", internalType: "uint256", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "success_", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "authorizer", internalType: "address", type: "address" },
      { name: "nonce", internalType: "bytes32", type: "bytes32" },
    ],
    name: "authorizationState",
    outputs: [{ name: "isNonceUsed", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "account_", internalType: "address", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "bootstrapEpoch",
    outputs: [{ name: "", internalType: "uint16", type: "uint16" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "bootstrapToken",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "minAmount_", internalType: "uint256", type: "uint256" },
      { name: "maxAmount_", internalType: "uint256", type: "uint256" },
      { name: "destination_", internalType: "address", type: "address" },
    ],
    name: "buy",
    outputs: [
      { name: "amount_", internalType: "uint240", type: "uint240" },
      { name: "cost_", internalType: "uint256", type: "uint256" },
    ],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "authorizer_", internalType: "address", type: "address" },
      { name: "nonce_", internalType: "bytes32", type: "bytes32" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "vs_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "cancelAuthorization",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "authorizer_", internalType: "address", type: "address" },
      { name: "nonce_", internalType: "bytes32", type: "bytes32" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "cancelAuthorization",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "cashToken",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "clock",
    outputs: [{ name: "clock_", internalType: "uint48", type: "uint48" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "delegatee_", internalType: "address", type: "address" }],
    name: "delegate",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "account_", internalType: "address", type: "address" }],
    name: "delegates",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "amount_", internalType: "uint256", type: "uint256" }],
    name: "getCost",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "delegatee_", internalType: "address", type: "address" },
      { name: "nonce_", internalType: "uint256", type: "uint256" },
      { name: "expiry_", internalType: "uint256", type: "uint256" },
    ],
    name: "getDelegationDigest",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "epoch_", internalType: "uint256", type: "uint256" },
    ],
    name: "getPastVotes",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "account_", internalType: "address", type: "address" }],
    name: "getVotes",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "delegatee_", internalType: "address", type: "address" },
      { name: "epoch_", internalType: "uint256", type: "uint256" },
    ],
    name: "hasParticipatedAt",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [],
    name: "markNextVotingEpochAsActive",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "delegatee_", internalType: "address", type: "address" }],
    name: "markParticipation",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "name_", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "account", internalType: "address", type: "address" }],
    name: "nonces",
    outputs: [{ name: "nonce", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "participationInflation",
    outputs: [{ name: "", internalType: "uint16", type: "uint16" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "epoch_", internalType: "uint256", type: "uint256" },
    ],
    name: "pastBalanceOf",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "epoch_", internalType: "uint256", type: "uint256" },
    ],
    name: "pastDelegates",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "epoch_", internalType: "uint256", type: "uint256" }],
    name: "pastTotalSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "nextCashToken_", internalType: "address", type: "address" },
    ],
    name: "setNextCashToken",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "standardGovernor",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "targetSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "recipient_", internalType: "address", type: "address" },
      { name: "amount_", internalType: "uint256", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "success_", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "sender_", internalType: "address", type: "address" },
      { name: "recipient_", internalType: "address", type: "address" },
      { name: "amount_", internalType: "uint256", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "success_", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "vault",
    outputs: [{ name: "", internalType: "address", type: "address" }],
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
  { type: "error", inputs: [], name: "AmountExceedsUint240" },
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
  {
    type: "error",
    inputs: [
      { name: "caller", internalType: "address", type: "address" },
      { name: "payee", internalType: "address", type: "address" },
    ],
    name: "CallerMustBePayee",
  },
  { type: "error", inputs: [], name: "DivideUpOverflow" },
  { type: "error", inputs: [], name: "DivisionByZero" },
  { type: "error", inputs: [], name: "InflationTooHigh" },
  {
    type: "error",
    inputs: [
      { name: "amountToAuction", internalType: "uint240", type: "uint240" },
      { name: "minAmountRequested", internalType: "uint240", type: "uint240" },
    ],
    name: "InsufficientAuctionSupply",
  },
  { type: "error", inputs: [], name: "InvalidBootstrapTokenAddress" },
  { type: "error", inputs: [], name: "InvalidCashTokenAddress" },
  { type: "error", inputs: [], name: "InvalidSignature" },
  { type: "error", inputs: [], name: "InvalidSignatureLength" },
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
      { name: "nonce", internalType: "uint256", type: "uint256" },
      { name: "expectedNonce", internalType: "uint256", type: "uint256" },
    ],
    name: "ReusedNonce",
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
  { type: "error", inputs: [], name: "TransferFromFailed" },
  { type: "error", inputs: [], name: "VoteEpoch" },
] as const;

/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Registrar
/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const registrarABI = [
  {
    stateMutability: "nonpayable",
    type: "constructor",
    inputs: [
      { name: "zeroGovernor_", internalType: "address", type: "address" },
    ],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "list_", internalType: "bytes32", type: "bytes32" },
      { name: "account_", internalType: "address", type: "address" },
    ],
    name: "addToList",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "emergencyGovernor",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "emergencyGovernorDeployer",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "key_", internalType: "bytes32", type: "bytes32" }],
    name: "get",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "keys_", internalType: "bytes32[]", type: "bytes32[]" }],
    name: "get",
    outputs: [
      { name: "values_", internalType: "bytes32[]", type: "bytes32[]" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "list_", internalType: "bytes32", type: "bytes32" },
      { name: "accounts_", internalType: "address[]", type: "address[]" },
    ],
    name: "listContains",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "list_", internalType: "bytes32", type: "bytes32" },
      { name: "account_", internalType: "address", type: "address" },
    ],
    name: "listContains",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "powerToken",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "powerTokenDeployer",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "list_", internalType: "bytes32", type: "bytes32" },
      { name: "account_", internalType: "address", type: "address" },
    ],
    name: "removeFromList",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "key_", internalType: "bytes32", type: "bytes32" },
      { name: "value_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "setKey",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "standardGovernor",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "standardGovernorDeployer",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "vault",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "zeroGovernor",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "zeroToken",
    outputs: [{ name: "", internalType: "address", type: "address" }],
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

/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// StandardGovernor
/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const standardGovernorABI = [
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "BALLOTS_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "BALLOT_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "pure",
    type: "function",
    inputs: [],
    name: "CLOCK_MODE",
    outputs: [{ name: "", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "pure",
    type: "function",
    inputs: [],
    name: "COUNTING_MODE",
    outputs: [{ name: "", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "ONE",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "list_", internalType: "bytes32", type: "bytes32" },
      { name: "account_", internalType: "address", type: "address" },
    ],
    name: "addToList",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "cashToken",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
    ],
    name: "castVote",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "voter_", internalType: "address", type: "address" },
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "castVoteBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
      { name: "", internalType: "string", type: "string" },
    ],
    name: "castVoteWithReason",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
    ],
    name: "castVotes",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "voter_", internalType: "address", type: "address" },
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "castVotesBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "clock",
    outputs: [{ name: "", internalType: "uint48", type: "uint48" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "emergencyGovernor",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "payable",
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
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
    ],
    name: "getBallotDigest",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
    ],
    name: "getBallotsDigest",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
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
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "timepoint_", internalType: "uint256", type: "uint256" },
    ],
    name: "getVotes",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "proposalId", internalType: "uint256", type: "uint256" },
      { name: "voter", internalType: "address", type: "address" },
    ],
    name: "hasVoted",
    outputs: [{ name: "hasVoted", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "voter_", internalType: "address", type: "address" },
      { name: "epoch_", internalType: "uint256", type: "uint256" },
    ],
    name: "hasVotedOnAllProposals",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "callData_", internalType: "bytes", type: "bytes" }],
    name: "hashProposal",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "", internalType: "address[]", type: "address[]" },
      { name: "", internalType: "uint256[]", type: "uint256[]" },
      { name: "callDatas_", internalType: "bytes[]", type: "bytes[]" },
      { name: "", internalType: "bytes32", type: "bytes32" },
    ],
    name: "hashProposal",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "maxTotalZeroRewardPerActiveEpoch",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "epoch", internalType: "uint256", type: "uint256" }],
    name: "numberOfProposalsAt",
    outputs: [{ name: "count", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "voter", internalType: "address", type: "address" },
      { name: "epoch", internalType: "uint256", type: "uint256" },
    ],
    name: "numberOfProposalsVotedOnAt",
    outputs: [{ name: "count", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "proposalDeadline",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "proposalFee",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "proposalProposer",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "proposalSnapshot",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "pure",
    type: "function",
    inputs: [],
    name: "proposalThreshold",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "pure",
    type: "function",
    inputs: [],
    name: "quorum",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "pure",
    type: "function",
    inputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    name: "quorum",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "registrar",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "list_", internalType: "bytes32", type: "bytes32" },
      { name: "accountToRemove_", internalType: "address", type: "address" },
      { name: "accountToAdd_", internalType: "address", type: "address" },
    ],
    name: "removeFromAndAddToList",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "list_", internalType: "bytes32", type: "bytes32" },
      { name: "account_", internalType: "address", type: "address" },
    ],
    name: "removeFromList",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "sendProposalFeeToVault",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "newCashToken_", internalType: "address", type: "address" },
      { name: "newProposalFee_", internalType: "uint256", type: "uint256" },
    ],
    name: "setCashToken",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "key_", internalType: "bytes32", type: "bytes32" },
      { name: "value_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "setKey",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "newProposalFee_", internalType: "uint256", type: "uint256" },
    ],
    name: "setProposalFee",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "state",
    outputs: [
      { name: "", internalType: "enum IGovernor.ProposalState", type: "uint8" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "vault",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "voteToken",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "votingDelay",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "votingPeriod",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "zeroGovernor",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "zeroToken",
    outputs: [{ name: "", internalType: "address", type: "address" }],
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
  { type: "error", inputs: [], name: "InvalidEpoch" },
  { type: "error", inputs: [], name: "InvalidRegistrarAddress" },
  { type: "error", inputs: [], name: "InvalidSignature" },
  { type: "error", inputs: [], name: "InvalidSignatureLength" },
  { type: "error", inputs: [], name: "InvalidTarget" },
  { type: "error", inputs: [], name: "InvalidTargetsLength" },
  { type: "error", inputs: [], name: "InvalidValue" },
  { type: "error", inputs: [], name: "InvalidValuesLength" },
  { type: "error", inputs: [], name: "InvalidVaultAddress" },
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
    name: "ProposalNotActive",
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

/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ZeroGovernor
/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const zeroGovernorABI = [
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "BALLOTS_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "BALLOT_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "pure",
    type: "function",
    inputs: [],
    name: "CLOCK_MODE",
    outputs: [{ name: "", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "pure",
    type: "function",
    inputs: [],
    name: "COUNTING_MODE",
    outputs: [{ name: "", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "ONE",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
    ],
    name: "castVote",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "voter_", internalType: "address", type: "address" },
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "castVoteBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
      { name: "", internalType: "string", type: "string" },
    ],
    name: "castVoteWithReason",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
    ],
    name: "castVotes",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "voter_", internalType: "address", type: "address" },
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "castVotesBySig",
    outputs: [{ name: "weight_", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "clock",
    outputs: [{ name: "", internalType: "uint48", type: "uint48" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "emergencyGovernor",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "emergencyGovernorDeployer",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "payable",
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
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "proposalId_", internalType: "uint256", type: "uint256" },
      { name: "support_", internalType: "uint8", type: "uint8" },
    ],
    name: "getBallotDigest",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "proposalIds_", internalType: "uint256[]", type: "uint256[]" },
      { name: "supportList_", internalType: "uint8[]", type: "uint8[]" },
    ],
    name: "getBallotsDigest",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
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
      { name: "thresholdRatio_", internalType: "uint16", type: "uint16" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "timepoint_", internalType: "uint256", type: "uint256" },
    ],
    name: "getVotes",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "proposalId", internalType: "uint256", type: "uint256" },
      { name: "voter", internalType: "address", type: "address" },
    ],
    name: "hasVoted",
    outputs: [{ name: "hasVoted", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "callData_", internalType: "bytes", type: "bytes" }],
    name: "hashProposal",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "", internalType: "address[]", type: "address[]" },
      { name: "", internalType: "uint256[]", type: "uint256[]" },
      { name: "callDatas_", internalType: "bytes[]", type: "bytes[]" },
      { name: "", internalType: "bytes32", type: "bytes32" },
    ],
    name: "hashProposal",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "token_", internalType: "address", type: "address" }],
    name: "isAllowedCashToken",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "powerTokenDeployer",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "proposalDeadline",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "proposalProposer",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "proposalId_", internalType: "uint256", type: "uint256" }],
    name: "proposalSnapshot",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "pure",
    type: "function",
    inputs: [],
    name: "proposalThreshold",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "quorum",
    outputs: [{ name: "quorum_", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "timepoint_", internalType: "uint256", type: "uint256" }],
    name: "quorum",
    outputs: [{ name: "quorum_", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [],
    name: "resetToPowerHolders",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [],
    name: "resetToZeroHolders",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "newCashToken_", internalType: "address", type: "address" },
      { name: "newProposalFee_", internalType: "uint256", type: "uint256" },
    ],
    name: "setCashToken",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "newThresholdRatio_", internalType: "uint16", type: "uint16" },
    ],
    name: "setEmergencyProposalThresholdRatio",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "newThresholdRatio_", internalType: "uint16", type: "uint16" },
    ],
    name: "setZeroProposalThresholdRatio",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "standardGovernor",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "standardGovernorDeployer",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
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
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "thresholdRatio",
    outputs: [{ name: "", internalType: "uint16", type: "uint16" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "voteToken",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "votingDelay",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "votingPeriod",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
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
  { type: "error", inputs: [], name: "InvalidEpoch" },
  { type: "error", inputs: [], name: "InvalidPowerTokenDeployerAddress" },
  { type: "error", inputs: [], name: "InvalidSignature" },
  { type: "error", inputs: [], name: "InvalidSignatureLength" },
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
  { type: "error", inputs: [], name: "InvalidUInt16" },
  { type: "error", inputs: [], name: "InvalidValue" },
  { type: "error", inputs: [], name: "InvalidValuesLength" },
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
    name: "ProposalNotActive",
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

/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ZeroToken
/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const zeroTokenABI = [
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "CANCEL_AUTHORIZATION_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "pure",
    type: "function",
    inputs: [],
    name: "CLOCK_MODE",
    outputs: [{ name: "clockMode_", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "DELEGATION_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "PERMIT_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "RECEIVE_WITH_AUTHORIZATION_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "TRANSFER_WITH_AUTHORIZATION_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "account", internalType: "address", type: "address" },
      { name: "spender", internalType: "address", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "allowance", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "spender_", internalType: "address", type: "address" },
      { name: "amount_", internalType: "uint256", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "success_", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "authorizer", internalType: "address", type: "address" },
      { name: "nonce", internalType: "bytes32", type: "bytes32" },
    ],
    name: "authorizationState",
    outputs: [{ name: "isNonceUsed", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "account_", internalType: "address", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "authorizer_", internalType: "address", type: "address" },
      { name: "nonce_", internalType: "bytes32", type: "bytes32" },
      { name: "r_", internalType: "bytes32", type: "bytes32" },
      { name: "vs_", internalType: "bytes32", type: "bytes32" },
    ],
    name: "cancelAuthorization",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "authorizer_", internalType: "address", type: "address" },
      { name: "nonce_", internalType: "bytes32", type: "bytes32" },
      { name: "signature_", internalType: "bytes", type: "bytes" },
    ],
    name: "cancelAuthorization",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "clock",
    outputs: [{ name: "clock_", internalType: "uint48", type: "uint48" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "delegatee_", internalType: "address", type: "address" }],
    name: "delegate",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "account_", internalType: "address", type: "address" }],
    name: "delegates",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "delegatee_", internalType: "address", type: "address" },
      { name: "nonce_", internalType: "uint256", type: "uint256" },
      { name: "expiry_", internalType: "uint256", type: "uint256" },
    ],
    name: "getDelegationDigest",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "epoch_", internalType: "uint256", type: "uint256" },
    ],
    name: "getPastVotes",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "startEpoch_", internalType: "uint256", type: "uint256" },
      { name: "endEpoch_", internalType: "uint256", type: "uint256" },
    ],
    name: "getPastVotes",
    outputs: [{ name: "", internalType: "uint256[]", type: "uint256[]" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "account_", internalType: "address", type: "address" }],
    name: "getVotes",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "recipient_", internalType: "address", type: "address" },
      { name: "amount_", internalType: "uint256", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "name_", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "account", internalType: "address", type: "address" }],
    name: "nonces",
    outputs: [{ name: "nonce", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "epoch_", internalType: "uint256", type: "uint256" },
    ],
    name: "pastBalanceOf",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "startEpoch_", internalType: "uint256", type: "uint256" },
      { name: "endEpoch_", internalType: "uint256", type: "uint256" },
    ],
    name: "pastBalancesOf",
    outputs: [{ name: "", internalType: "uint256[]", type: "uint256[]" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "epoch_", internalType: "uint256", type: "uint256" },
    ],
    name: "pastDelegates",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "account_", internalType: "address", type: "address" },
      { name: "startEpoch_", internalType: "uint256", type: "uint256" },
      { name: "endEpoch_", internalType: "uint256", type: "uint256" },
    ],
    name: "pastDelegates",
    outputs: [{ name: "", internalType: "address[]", type: "address[]" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "startEpoch_", internalType: "uint256", type: "uint256" },
      { name: "endEpoch_", internalType: "uint256", type: "uint256" },
    ],
    name: "pastTotalSupplies",
    outputs: [{ name: "", internalType: "uint256[]", type: "uint256[]" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "epoch_", internalType: "uint256", type: "uint256" }],
    name: "pastTotalSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "standardGovernor",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "standardGovernorDeployer",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "recipient_", internalType: "address", type: "address" },
      { name: "amount_", internalType: "uint256", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "success_", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "sender_", internalType: "address", type: "address" },
      { name: "recipient_", internalType: "address", type: "address" },
      { name: "amount_", internalType: "uint256", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "success_", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "nonpayable",
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
  },
  {
    stateMutability: "nonpayable",
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
  { type: "error", inputs: [], name: "AmountExceedsUint240" },
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
  { type: "error", inputs: [], name: "InvalidSignature" },
  { type: "error", inputs: [], name: "InvalidSignatureLength" },
  { type: "error", inputs: [], name: "InvalidStandardGovernorDeployerAddress" },
  { type: "error", inputs: [], name: "InvalidUInt16" },
  { type: "error", inputs: [], name: "InvalidUInt240" },
  {
    type: "error",
    inputs: [
      { name: "accountsLength", internalType: "uint256", type: "uint256" },
      { name: "balancesLength", internalType: "uint256", type: "uint256" },
    ],
    name: "LengthMismatch",
  },
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
      { name: "nonce", internalType: "uint256", type: "uint256" },
      { name: "expectedNonce", internalType: "uint256", type: "uint256" },
    ],
    name: "ReusedNonce",
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
  { type: "error", inputs: [], name: "StartEpochAfterEndEpoch" },
] as const;

/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Core
/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link distributionVaultABI}__.
 */
export function getDistributionVault(config: Omit<GetContractArgs, "abi">) {
  return getContract({ abi: distributionVaultABI, ...config });
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link distributionVaultABI}__.
 */
export function readDistributionVault<
  TAbi extends readonly unknown[] = typeof distributionVaultABI,
  TFunctionName extends string = string
>(config: Omit<ReadContractConfig<TAbi, TFunctionName>, "abi">) {
  return readContract({
    abi: distributionVaultABI,
    ...config,
  } as unknown as ReadContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link distributionVaultABI}__.
 */
export function writeDistributionVault<TFunctionName extends string>(
  config:
    | Omit<
        WriteContractPreparedArgs<typeof distributionVaultABI, TFunctionName>,
        "abi"
      >
    | Omit<
        WriteContractUnpreparedArgs<typeof distributionVaultABI, TFunctionName>,
        "abi"
      >
) {
  return writeContract({
    abi: distributionVaultABI,
    ...config,
  } as unknown as WriteContractArgs<typeof distributionVaultABI, TFunctionName>);
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link distributionVaultABI}__.
 */
export function prepareWriteDistributionVault<
  TAbi extends readonly unknown[] = typeof distributionVaultABI,
  TFunctionName extends string = string
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, "abi">) {
  return prepareWriteContract({
    abi: distributionVaultABI,
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link distributionVaultABI}__.
 */
export function watchDistributionVaultEvent<
  TAbi extends readonly unknown[] = typeof distributionVaultABI,
  TEventName extends string = string
>(
  config: Omit<WatchContractEventConfig<TAbi, TEventName>, "abi">,
  callback: WatchContractEventCallback<TAbi, TEventName>
) {
  return watchContractEvent(
    { abi: distributionVaultABI, ...config } as WatchContractEventConfig<
      TAbi,
      TEventName
    >,
    callback
  );
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link emergencyGovernorABI}__.
 */
export function getEmergencyGovernor(config: Omit<GetContractArgs, "abi">) {
  return getContract({ abi: emergencyGovernorABI, ...config });
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link emergencyGovernorABI}__.
 */
export function readEmergencyGovernor<
  TAbi extends readonly unknown[] = typeof emergencyGovernorABI,
  TFunctionName extends string = string
>(config: Omit<ReadContractConfig<TAbi, TFunctionName>, "abi">) {
  return readContract({
    abi: emergencyGovernorABI,
    ...config,
  } as unknown as ReadContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link emergencyGovernorABI}__.
 */
export function writeEmergencyGovernor<TFunctionName extends string>(
  config:
    | Omit<
        WriteContractPreparedArgs<typeof emergencyGovernorABI, TFunctionName>,
        "abi"
      >
    | Omit<
        WriteContractUnpreparedArgs<typeof emergencyGovernorABI, TFunctionName>,
        "abi"
      >
) {
  return writeContract({
    abi: emergencyGovernorABI,
    ...config,
  } as unknown as WriteContractArgs<typeof emergencyGovernorABI, TFunctionName>);
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link emergencyGovernorABI}__.
 */
export function prepareWriteEmergencyGovernor<
  TAbi extends readonly unknown[] = typeof emergencyGovernorABI,
  TFunctionName extends string = string
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, "abi">) {
  return prepareWriteContract({
    abi: emergencyGovernorABI,
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link emergencyGovernorABI}__.
 */
export function watchEmergencyGovernorEvent<
  TAbi extends readonly unknown[] = typeof emergencyGovernorABI,
  TEventName extends string = string
>(
  config: Omit<WatchContractEventConfig<TAbi, TEventName>, "abi">,
  callback: WatchContractEventCallback<TAbi, TEventName>
) {
  return watchContractEvent(
    { abi: emergencyGovernorABI, ...config } as WatchContractEventConfig<
      TAbi,
      TEventName
    >,
    callback
  );
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link powerTokenABI}__.
 */
export function getPowerToken(config: Omit<GetContractArgs, "abi">) {
  return getContract({ abi: powerTokenABI, ...config });
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link powerTokenABI}__.
 */
export function readPowerToken<
  TAbi extends readonly unknown[] = typeof powerTokenABI,
  TFunctionName extends string = string
>(config: Omit<ReadContractConfig<TAbi, TFunctionName>, "abi">) {
  return readContract({
    abi: powerTokenABI,
    ...config,
  } as unknown as ReadContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link powerTokenABI}__.
 */
export function writePowerToken<TFunctionName extends string>(
  config:
    | Omit<
        WriteContractPreparedArgs<typeof powerTokenABI, TFunctionName>,
        "abi"
      >
    | Omit<
        WriteContractUnpreparedArgs<typeof powerTokenABI, TFunctionName>,
        "abi"
      >
) {
  return writeContract({
    abi: powerTokenABI,
    ...config,
  } as unknown as WriteContractArgs<typeof powerTokenABI, TFunctionName>);
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link powerTokenABI}__.
 */
export function prepareWritePowerToken<
  TAbi extends readonly unknown[] = typeof powerTokenABI,
  TFunctionName extends string = string
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, "abi">) {
  return prepareWriteContract({
    abi: powerTokenABI,
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link powerTokenABI}__.
 */
export function watchPowerTokenEvent<
  TAbi extends readonly unknown[] = typeof powerTokenABI,
  TEventName extends string = string
>(
  config: Omit<WatchContractEventConfig<TAbi, TEventName>, "abi">,
  callback: WatchContractEventCallback<TAbi, TEventName>
) {
  return watchContractEvent(
    { abi: powerTokenABI, ...config } as WatchContractEventConfig<
      TAbi,
      TEventName
    >,
    callback
  );
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link registrarABI}__.
 */
export function getRegistrar(config: Omit<GetContractArgs, "abi">) {
  return getContract({ abi: registrarABI, ...config });
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link registrarABI}__.
 */
export function readRegistrar<
  TAbi extends readonly unknown[] = typeof registrarABI,
  TFunctionName extends string = string
>(config: Omit<ReadContractConfig<TAbi, TFunctionName>, "abi">) {
  return readContract({
    abi: registrarABI,
    ...config,
  } as unknown as ReadContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link registrarABI}__.
 */
export function writeRegistrar<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof registrarABI, TFunctionName>, "abi">
    | Omit<
        WriteContractUnpreparedArgs<typeof registrarABI, TFunctionName>,
        "abi"
      >
) {
  return writeContract({
    abi: registrarABI,
    ...config,
  } as unknown as WriteContractArgs<typeof registrarABI, TFunctionName>);
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link registrarABI}__.
 */
export function prepareWriteRegistrar<
  TAbi extends readonly unknown[] = typeof registrarABI,
  TFunctionName extends string = string
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, "abi">) {
  return prepareWriteContract({
    abi: registrarABI,
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link registrarABI}__.
 */
export function watchRegistrarEvent<
  TAbi extends readonly unknown[] = typeof registrarABI,
  TEventName extends string = string
>(
  config: Omit<WatchContractEventConfig<TAbi, TEventName>, "abi">,
  callback: WatchContractEventCallback<TAbi, TEventName>
) {
  return watchContractEvent(
    { abi: registrarABI, ...config } as WatchContractEventConfig<
      TAbi,
      TEventName
    >,
    callback
  );
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link standardGovernorABI}__.
 */
export function getStandardGovernor(config: Omit<GetContractArgs, "abi">) {
  return getContract({ abi: standardGovernorABI, ...config });
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link standardGovernorABI}__.
 */
export function readStandardGovernor<
  TAbi extends readonly unknown[] = typeof standardGovernorABI,
  TFunctionName extends string = string
>(config: Omit<ReadContractConfig<TAbi, TFunctionName>, "abi">) {
  return readContract({
    abi: standardGovernorABI,
    ...config,
  } as unknown as ReadContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link standardGovernorABI}__.
 */
export function writeStandardGovernor<TFunctionName extends string>(
  config:
    | Omit<
        WriteContractPreparedArgs<typeof standardGovernorABI, TFunctionName>,
        "abi"
      >
    | Omit<
        WriteContractUnpreparedArgs<typeof standardGovernorABI, TFunctionName>,
        "abi"
      >
) {
  return writeContract({
    abi: standardGovernorABI,
    ...config,
  } as unknown as WriteContractArgs<typeof standardGovernorABI, TFunctionName>);
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link standardGovernorABI}__.
 */
export function prepareWriteStandardGovernor<
  TAbi extends readonly unknown[] = typeof standardGovernorABI,
  TFunctionName extends string = string
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, "abi">) {
  return prepareWriteContract({
    abi: standardGovernorABI,
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link standardGovernorABI}__.
 */
export function watchStandardGovernorEvent<
  TAbi extends readonly unknown[] = typeof standardGovernorABI,
  TEventName extends string = string
>(
  config: Omit<WatchContractEventConfig<TAbi, TEventName>, "abi">,
  callback: WatchContractEventCallback<TAbi, TEventName>
) {
  return watchContractEvent(
    { abi: standardGovernorABI, ...config } as WatchContractEventConfig<
      TAbi,
      TEventName
    >,
    callback
  );
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link zeroGovernorABI}__.
 */
export function getZeroGovernor(config: Omit<GetContractArgs, "abi">) {
  return getContract({ abi: zeroGovernorABI, ...config });
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroGovernorABI}__.
 */
export function readZeroGovernor<
  TAbi extends readonly unknown[] = typeof zeroGovernorABI,
  TFunctionName extends string = string
>(config: Omit<ReadContractConfig<TAbi, TFunctionName>, "abi">) {
  return readContract({
    abi: zeroGovernorABI,
    ...config,
  } as unknown as ReadContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroGovernorABI}__.
 */
export function writeZeroGovernor<TFunctionName extends string>(
  config:
    | Omit<
        WriteContractPreparedArgs<typeof zeroGovernorABI, TFunctionName>,
        "abi"
      >
    | Omit<
        WriteContractUnpreparedArgs<typeof zeroGovernorABI, TFunctionName>,
        "abi"
      >
) {
  return writeContract({
    abi: zeroGovernorABI,
    ...config,
  } as unknown as WriteContractArgs<typeof zeroGovernorABI, TFunctionName>);
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link zeroGovernorABI}__.
 */
export function prepareWriteZeroGovernor<
  TAbi extends readonly unknown[] = typeof zeroGovernorABI,
  TFunctionName extends string = string
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, "abi">) {
  return prepareWriteContract({
    abi: zeroGovernorABI,
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link zeroGovernorABI}__.
 */
export function watchZeroGovernorEvent<
  TAbi extends readonly unknown[] = typeof zeroGovernorABI,
  TEventName extends string = string
>(
  config: Omit<WatchContractEventConfig<TAbi, TEventName>, "abi">,
  callback: WatchContractEventCallback<TAbi, TEventName>
) {
  return watchContractEvent(
    { abi: zeroGovernorABI, ...config } as WatchContractEventConfig<
      TAbi,
      TEventName
    >,
    callback
  );
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link zeroTokenABI}__.
 */
export function getZeroToken(config: Omit<GetContractArgs, "abi">) {
  return getContract({ abi: zeroTokenABI, ...config });
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zeroTokenABI}__.
 */
export function readZeroToken<
  TAbi extends readonly unknown[] = typeof zeroTokenABI,
  TFunctionName extends string = string
>(config: Omit<ReadContractConfig<TAbi, TFunctionName>, "abi">) {
  return readContract({
    abi: zeroTokenABI,
    ...config,
  } as unknown as ReadContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zeroTokenABI}__.
 */
export function writeZeroToken<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof zeroTokenABI, TFunctionName>, "abi">
    | Omit<
        WriteContractUnpreparedArgs<typeof zeroTokenABI, TFunctionName>,
        "abi"
      >
) {
  return writeContract({
    abi: zeroTokenABI,
    ...config,
  } as unknown as WriteContractArgs<typeof zeroTokenABI, TFunctionName>);
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link zeroTokenABI}__.
 */
export function prepareWriteZeroToken<
  TAbi extends readonly unknown[] = typeof zeroTokenABI,
  TFunctionName extends string = string
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, "abi">) {
  return prepareWriteContract({
    abi: zeroTokenABI,
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link zeroTokenABI}__.
 */
export function watchZeroTokenEvent<
  TAbi extends readonly unknown[] = typeof zeroTokenABI,
  TEventName extends string = string
>(
  config: Omit<WatchContractEventConfig<TAbi, TEventName>, "abi">,
  callback: WatchContractEventCallback<TAbi, TEventName>
) {
  return watchContractEvent(
    { abi: zeroTokenABI, ...config } as WatchContractEventConfig<
      TAbi,
      TEventName
    >,
    callback
  );
}
