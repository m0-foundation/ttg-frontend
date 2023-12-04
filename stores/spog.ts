import { defineStore } from "pinia";
import { Hash } from "viem";
import { fetchToken, FetchTokenResult } from "@wagmi/core";
import {
  MGovernorValues,
  MEpoch,
  MProposalsActionTypes,
  MStandardGovernorValues,
} from "@/lib/api/types";
import { MRegistrarStore } from "@/lib/api/modules/registrar/registrar.types";

export const useSpogStore = defineStore("spog", {
  state: () => ({
    epoch: {} as MEpoch,
    contracts: {} as Partial<MRegistrarStore>,
    governors: {
      standard: {} as Partial<MStandardGovernorValues>,
      emergency: {} as Partial<MGovernorValues>,
      zero: {} as Partial<MGovernorValues>,
    },
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
        setProposalFee: useFormatCash(state.governors.standard.proposalFee!),
        setPowerTokenThresholdRatio: state.governors.emergency.thresholdRatio!,
        setZeroTokenThresholdRatio: state.governors.zero.thresholdRatio!,
      };

      return values;
    },

    getValues: (state) => {
      return {
        proposalFee: state.governors.standard.proposalFee!,
        powerTokenThresholdRatio: state.governors.emergency.thresholdRatio!,
        zeroTokenThresholdRatio: state.governors.zero.thresholdRatio!,
      };
    },
  },

  actions: {
    async fetchEpoch() {
      const api = useApiClientStore();
      const epoch = await api.client.epoch.getEpochState();
      this.epoch = epoch;
    },
    async fetchTokens() {
      console.log("fetchTokens");
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

    setContracts(params: Partial<MRegistrarStore>) {
      this.contracts = params;
    },

    setGovernorsValues({
      standard,
      emergency,
      zero,
    }: {
      standard: Partial<MStandardGovernorValues>;
      emergency: Partial<MGovernorValues>;
      zero: Partial<MGovernorValues>;
    }) {
      this.governors = {
        standard,
        emergency,
        zero,
      };
    },

    async fetchGovernorsValues() {
      const api = useApiClientStore();

      const [standard, emergency, zero] = await Promise.all([
        // eslint-disable-next-line prettier/prettier
        api.client.standardGovernor!.getParameters<Partial<MStandardGovernorValues>>([
          // eslint-disable-next-line prettier/prettier
          "proposalFee", "cashToken", "maxTotalZeroRewardPerActiveEpoch"
        ]),
        api.client.emergencyGovernor!.getParameters<Partial<MGovernorValues>>([
          "thresholdRatio",
        ]),
        api.client.zeroGovernor!.getParameters<Partial<MGovernorValues>>([
          "thresholdRatio",
        ]),
      ]);

      this.contracts.cashToken = standard.cashToken;

      this.setGovernorsValues({
        standard,
        emergency,
        zero,
      });
    },
  },
});
