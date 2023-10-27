import { Hash } from "viem";
import { EventLog } from "../../../event/event.types";

export interface MListEvent extends EventLog {
  eventName: "AddressAddedToList" | "AddressRemovedFromList";
  list: string;
  account: string;
  timestamp: number;
}

export interface MLists {
  [list: string]: Array<MListEvent>;
}

export interface MListDecoded {
  eventName: string;
  args: { list: Hash; account: Hash };
}
