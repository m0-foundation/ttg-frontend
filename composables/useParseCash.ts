import { parseUnits } from "viem";

/*
 parse cash string like 0.001 to wei bigint folowing cash decimals
*/
export const useParseCash = (cash: string) => {
  const cashToken = useTtgStore().tokens.cash;
  return parseUnits(cash, cashToken.decimals || 18);
};
