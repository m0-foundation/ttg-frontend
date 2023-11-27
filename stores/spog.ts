import { defineStore } from "pinia";
import { Hash } from "viem";
import { fetchToken, FetchTokenResult } from "@wagmi/core";
import {
  MGovernorContracts,
  MGovernorValues,
  MEpoch,
  MProposalsActionTypes,
} from "@/lib/api/types";

export const useSpogStore = defineStore("spog", {
  state: () => ({
    epoch: {} as MEpoch,
    contracts: {} as Partial<MGovernorContracts>,
    values: {} as Partial<MGovernorValues>,
    tokens: {
      cash: {} as Partial<FetchTokenResult>,
      power: {} as Partial<FetchTokenResult>,
      zero: {} as Partial<FetchTokenResult>,
    },
  }),

  getters: {
    getEpoch: (state) => state.epoch,

    getValuesFormatted: (state) => {
      const values: MProposalsActionTypes = {
        setProposalFee: useFormatCash(state.values.proposalFee!),
        setPowerTokenThresholdRatio: state.values.powerTokenThresholdRatio!,
        setZeroTokenThresholdRatio: state.values.zeroTokenThresholdRatio!,
      };

      return values;
    },
  },

  actions: {
    setEpoch(epoch: MEpoch) {
      this.epoch = epoch;
    },
    async setContracts(params: Partial<MGovernorContracts>) {
      this.contracts = params;

      const [cashToken, powerToken, zeroToken] = await Promise.all([
        fetchToken({
          address: this.contracts.cashToken as Hash,
        }),
        fetchToken({
          address: this.contracts.powerToken as Hash,
        }),
        fetchToken({
          address: this.contracts.zeroToken as Hash,
        }),
      ]);

      this.tokens.cash = cashToken;
      this.tokens.power = powerToken;
      this.tokens.zero = zeroToken;
    },
    setValues(params: Partial<MGovernorValues>) {
      this.values = params;
    },
  },
});
