import { parseAbiItem } from "viem";
import { GovernorModule } from "../GovernorModule";
import { MVote } from "./voting.types";

export class Voting extends GovernorModule {
  async decodeVote(log: any): Promise<MVote> {
    const vote = {
      proposalId: log?.args?.proposalId?.toString(),
      reason: log?.args?.reason,
      support: Boolean(log?.args?.support),
      voter: log?.args?.voter?.toString(),
      weight: log?.args?.weight,
      transactionHash: log.transactionHash?.toString(),
      blockNumber: Number(log.blockNumber),
      eventName: log.eventName,
      data: log.data,
    } as MVote;

    vote.voteId = `${vote.proposalId}_${vote.voter}`;

    return vote;
  }

  async getAllVotes(): Promise<MVote[]> {
    const rawLogs = await this.client.getLogs({
      address: this.contract,
      fromBlock: this.config.deploymentBlock,
      event: parseAbiItem(
        "event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 weight, string reason)",
      ),
    });

    const votes = await Promise.all(rawLogs.map((log) => this.decodeVote(log)));

    return votes;
  }
}
