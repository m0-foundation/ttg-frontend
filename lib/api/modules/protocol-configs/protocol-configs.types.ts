import { Hash } from "viem";
import { EventLog } from "../event/event.types";

export interface MUpdateConfigEvent extends EventLog {
  valueName: string;
  value: string | number | bigint | Hash | object;
  timestamp: number;
}

export interface MProtocolConfig {
  [valueName: string]: {
    value: string | number | bigint | Hash | object;
    timestamp: number;
  };
}
