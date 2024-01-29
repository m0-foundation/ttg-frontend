import { Hash } from "viem";
import { EventLog } from "../../event/event.types";

export interface MUpdateConfigEvent extends EventLog {
  key: string;
  value: string | number | bigint | Hash | object;
  timestamp: number;
}

export interface MProtocolConfig {
  key: string;
  value: string | number | bigint | Hash | object;
}
