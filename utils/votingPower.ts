export const getVotingPowerPercentageByTotalSupply = (
  votingPower: bigint,
  totalSupply: bigint | undefined,
) => {
  if (!votingPower || !totalSupply) return 0;
  return Number((votingPower * 100n * 100n) / totalSupply) / 100;
};
