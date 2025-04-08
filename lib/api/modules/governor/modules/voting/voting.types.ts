import { EventLog } from '../../../event/event.types'

export interface MVote extends EventLog {
  proposalId?: string
  reason?: string
  support?: boolean
  voter?: string
  weight?: BigInt
  data?: string
  voteId?: string
  token?: 'power' | 'zero'
}

export enum MVotingTokens {
  Power = 'Power',
  Zero = 'Zero',
}
