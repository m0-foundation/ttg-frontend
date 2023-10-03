import { EventLog } from "../../../event/event.types";

export interface MVote extends EventLog {
  proposalId: string;
  reason: string;
  support: boolean;
  voter: string;
  weight: BigInt;
  timestamp?: number;
}

export enum MVotingTokens {
  Power = "Power",
  Zero = "Zero",
}
