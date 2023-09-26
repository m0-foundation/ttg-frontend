import { Hash, parseAbiItem } from "viem";

import { ApiModule } from "../..";
import { MVote } from "./voting.types";

export class Voting extends ApiModule {
  async getVotesByProposalId(proposalId: string): Promise<MVote[]> {
    const rawLogs = await this.client.getLogs({
      address: this.config.contracts!.governor as Hash,
      fromBlock: 0n,
      event: parseAbiItem(
        "event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 weight, string reason)"
      ),
    });
    // TODO filter by proposalId on query logs directly
    const votes: Array<MVote> = rawLogs.map((log) => ({
      proposalId: log?.args?.proposalId?.toString(),
      reason: log?.args?.reason,
      support: Boolean(log?.args?.support),
      voter: log?.args?.voter?.toString(),
      weight: log?.args?.weight,
      transactionHash: log.transactionHash?.toString(),
    }));

    return votes.filter((v) => v.proposalId === proposalId);
  }

  async getVotesByVoter(voter: string): Promise<MVote[]> {
    if (!voter) {
      throw new Error("Voter must be defined");
    }

    const rawLogs = await this.client.getLogs({
      address: this.config.contracts!.governor as Hash,
      fromBlock: 0n,
      event: parseAbiItem(
        "event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 weight, string reason)"
      ),
      args: {
        voter: voter as Hash,
      },
    });

    const votes: Array<MVote> = rawLogs.map((log) => ({
      eventName: log.eventName,
      proposalId: log?.args?.proposalId!.toString(),
      reason: log?.args?.reason,
      support: Boolean(log?.args?.support),
      voter: log?.args?.voter?.toString(),
      weight: log?.args?.weight,
      transactionHash: log.transactionHash?.toString(),
      blockNumber: Number(log.blockNumber),
    }));

    const votesWithTimestamp = await Promise.all(
      votes.map(async (vote) => {
        const block = await this.client.getBlock({
          blockNumber: BigInt(vote.blockNumber),
        });
        vote.timestamp = Number(block.timestamp);
        return vote;
      })
    );

    return votesWithTimestamp;
  }
}
