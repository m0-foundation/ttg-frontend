import { Hash } from 'viem'
import { ApiContext } from '@/lib/api/api-context'
import { ApiModule } from '@/lib/api/api-module'

export class GovernorModule extends ApiModule {
  contract: Hash

  constructor(governor: Hash, context: ApiContext) {
    super(context)
    this.contract = governor
  }
}
