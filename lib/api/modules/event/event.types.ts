export interface EventLog {
  eventName: string;
  calldatas?: Array<string>;
  endBlock?: number;
  startBlock?: number;
  signatures?: Array<string>;
  targets?: Array<string>;
  blockNumber: number;
  transactionHash: string;
}
