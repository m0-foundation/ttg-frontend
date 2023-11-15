import { formatUnits } from "viem";

/*
 parse cash bigint to string like 0.001 folowing cash decimals
*/
export const useFormatCash = (value: string) => {
  const cashToken = useSpogStore().tokens.cash;
  return formatUnits(BigInt(value || 0n), cashToken.decimals || 18);
};
