import { powerTokenAbi, zeroTokenAbi } from "@/lib/sdk";
import { readContract } from "@wagmi/core";
import { Hash, Abi, formatUnits } from "viem";

export const usePastVotes = async ({
  address,
  epoch,
  token,
}: {
  address: Hash;
  epoch: number;
  token: "power" | "zero";
}) => {
  const wagmiConfig = useWagmiConfig();
  const ttg = storeToRefs(useSpogStore());
  const selectedToken =
    token === "power" ? ttg.tokens.value.power : ttg.tokens.value.zero;
  const abi: Abi = token === "power" ? powerTokenAbi : zeroTokenAbi;

  const result = await readContract(wagmiConfig, {
    address: selectedToken.address as Hash,
    abi: abi,
    functionName: "getPastVotes",
    args: [address, BigInt(epoch)],
    account: address,
  });

  const votingPower = BigInt(result as unknown as bigint);

  return {
    value: votingPower,
    formatted: formatUnits(votingPower, selectedToken.decimals || 0),
    hasVotingPower: votingPower > 0n,
  };
};
