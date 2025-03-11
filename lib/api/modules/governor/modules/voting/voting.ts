import { Hash, formatUnits, parseAbiItem } from 'viem'
import { GovernorModule } from '../GovernorModule'
import { MVote } from './voting.types'
import { GovernanceType } from '../../governor.types'
import { ApiContext } from '@/lib/api/api-context'

export class Voting extends GovernorModule {
  governanceType: GovernanceType

  constructor(
    governor: Hash,
    context: ApiContext,
    governanceType: GovernanceType,
  ) {
    super(governor, context)
    this.governanceType = governanceType
  }

  async decodeVote(log: any): Promise<MVote> {
    const token = ['Standard', 'Emergency'].includes(this.governanceType)
      ? 'power'
      : 'zero'

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
      token: token,
    } as unknown as MVote

    vote.voteId = `${vote.proposalId}_${vote.voter}`

    return vote
  }

  async getAllVotes(): Promise<MVote[]> {
    const rawLogs = await this.client.getLogs({
      address: this.contract,
      fromBlock: this.config.deploymentBlock,
      event: parseAbiItem(
        'event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 weight, string reason)',
      ),
    })

    const votes = await Promise.all(rawLogs.map((log) => this.decodeVote(log)))

    return votes
  }
}
