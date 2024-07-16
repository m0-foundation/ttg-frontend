import { defineStore } from "pinia";
import { Hash } from "viem";
import {
  IToken,
  MGovernorValues,
  MEpoch,
  MProposalsActionTypes,
  MStandardGovernorValues,
  MZeroGovernorValues,
} from "../lib/api/types";
import { MRegistrarStore } from "@/lib/api/modules/registrar/registrar.types";
import { powerTokenAbi } from "@/lib/sdk";

export const useTtgStore = defineStore("ttg", {
  state: () => ({
    epoch: {} as MEpoch,
    values: {} as Partial<MRegistrarStore>,
    contracts: {} as Partial<MRegistrarStore>,
    governors: {
      standard: {} as Partial<MStandardGovernorValues>,
      emergency: {} as Partial<MGovernorValues>,
      zero: {} as Partial<MZeroGovernorValues>,
    },
    tokens: {
      cash: {} as Partial<IToken>,
      power: {} as Partial<IToken>,
      zero: {} as Partial<IToken>,
    },
  }),

  getters: {
    currentCashToken: (state) =>
      state.governors.zero.allowedCashTokens?.find(
        (token) =>
          token.address.toLowerCase() ===
          state.contracts.cashToken?.toLowerCase(),
      ),
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
        ...state.values,
      };
    },

    getTokens: (state) => state.tokens,
  },

  actions: {
    async fetchEpoch(_epoch: number) {
      const api = useApiClientStore();
      const epochState = await api.client.epoch.getEpochState(_epoch);
      this.epoch = epochState;

      // Re-fetch epoch data when current epoch ends
      setTimeout(
        () => {
          this.fetchEpoch(_epoch! + 1);
        },
        (epochState.current.end.timestamp - Date.now() / 1000 + 3) * 1000,
      );
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

    setRegistrarValues({
      clock,
      clockPeriod,
      clockStartingTimestamp,
      ...contracts
    }: Partial<MRegistrarStore>) {
      this.values = { clock, clockPeriod, clockStartingTimestamp };
      this.contracts = { ...contracts };
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
        api.client.standardGovernor!.getParameters<
          Partial<MStandardGovernorValues>
        >(["proposalFee", "cashToken", "maxTotalZeroRewardPerActiveEpoch"]),
        api.client.emergencyGovernor!.getParameters<Partial<MGovernorValues>>([
          "thresholdRatio",
        ]),
        api.client.zeroGovernor!.getParameters<Partial<MZeroGovernorValues>>([
          "thresholdRatio",
        ]),
      ]);

      const network = useNetworkStore();
      const allowedCashTokens =
        network.network.contracts.zero?.allowedCashTokens;
      if (allowedCashTokens) {
        const [weth, M] = await Promise.all([
          api.getToken(allowedCashTokens[0] as Hash),
          api.getToken(allowedCashTokens[1] as Hash),
        ]);
        zero.allowedCashTokens = [weth, M];
      }

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
        address: this.values.powerToken!,
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
