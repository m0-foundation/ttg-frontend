import { defineStore } from "pinia";
import { Abi, Hash } from "viem";
import {
  MGovernorValues,
  MEpoch,
  MProposalsActionTypes,
  MStandardGovernorValues,
} from "@/lib/api/types";
import { MRegistrarStore } from "@/lib/api/modules/registrar/registrar.types";
import { powerTokenAbi } from "@/lib/sdk";

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
        setEmergencyProposalThresholdRatio:
          state.governors.emergency.thresholdRatio!,
        setZeroProposalThresholdRatio: state.governors.zero.thresholdRatio!,
        setCashToken: state.contracts.cashToken as Hash,
      };

      return values;
    },

    getValues: (state) => {
      return {
        proposalFee: state.governors.standard.proposalFee!,
        emergencyProposalThresholdRatio:
          state.governors.emergency.thresholdRatio!,
        zeroProposalThresholdRatio: state.governors.zero.thresholdRatio!,
        clock: state.governors.standard.clock!,
      };
    },

    getTokens: (state) => state.tokens,
  },

  actions: {
    async fetchEpoch(_epoch: number) {
      const api = useApiClientStore();
      const epochState = await api.client.epoch.getEpochState(_epoch);
      this.epoch = epochState;
    },
    async fetchTokens() {
      const api = useApiClientStore();

      const [cashToken, powerToken, zeroToken] = await Promise.all([
        api.getToken(this.contracts.cashToken as Hash),
        api.getToken(this.contracts.powerToken as Hash),
        api.getToken(this.contracts.zeroToken as Hash),
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
          "proposalFee", "cashToken", "maxTotalZeroRewardPerActiveEpoch", "clock"
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

    fetchPowerTokenValue(values: string[]) {
      const api = useApiClientStore();

      const contractConfig = {
        address: this.contracts.powerToken!,
        abi: powerTokenAbi,
      };

      const contracts = values.map((value) => ({
        ...contractConfig,
        functionName: value,
      }));

      return api.client.context.client.multicall({
        multicallAddress: api.client.context.config.multicall3,
        contracts,
      });
    },
  },
});
