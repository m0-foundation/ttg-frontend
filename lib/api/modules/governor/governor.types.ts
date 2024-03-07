import { IToken } from "../../types";
import { MVotingType } from "./modules/proposal/proposal.types";

export interface MGovernorValues {
  thresholdRatio: string;
}

export interface MZeroGovernorValues extends MGovernorValues {
  allowedCashTokens: IToken[];
}

export interface MStandardGovernorValues {
  cashToken: string;
  proposalFee: string;
  maxTotalZeroRewardPerActiveEpoch: string;
  clock: number; // epoch
}

export type GovernanceType = MVotingType;

export type MGovernorState = MGovernorValues;
