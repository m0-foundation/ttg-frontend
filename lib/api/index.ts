import { createPublicClient, Hash, http, fallback } from 'viem'
import { IApiConfig } from './types'
import { ApiContext } from './api-context'
import { Registrar } from './modules/registrar'
import { Governor } from './modules/governor'

import { Epoch } from './modules/epoch'
import {
  zeroGovernorAbi,
  standardGovernorAbi,
  emergencyGovernorAbi,
} from '@/lib/sdk'
export { MVotingTokens } from './modules/governor/modules/voting/voting.types'

export class Api {
  context: ApiContext
  registrar: Registrar
  standardGovernor?: Governor
  zeroGovernor?: Governor
  emergencyGovernor?: Governor
  epoch: Epoch

  constructor({
    rpcUrl,
    fallbackRpcUrl,
    config,
  }: {
    rpcUrl: string
    fallbackRpcUrl?: string
    config: IApiConfig
  }) {
    const client = createPublicClient({
      cacheTime: 10_000,
      transport: fallbackRpcUrl
        ? fallback([http(rpcUrl), http(fallbackRpcUrl)])
        : http(rpcUrl),
    })

    this.context = new ApiContext(client, config)

    this.registrar = new Registrar(this.context)

    this.epoch = Epoch.instance
  }

  setRpc(rpcUrl: string) {
    this.context.client = createPublicClient({
      transport: http(rpcUrl),
    })
  }

  addConfig(config: Partial<IApiConfig>): void {
    this.context.config = { ...this.context.config, ...config }
  }

  setGovernors(governors: {
    standardGovernor: string
    zeroGovernor: string
    emergencyGovernor: string
  }) {
    this.standardGovernor = new Governor(
      governors.standardGovernor as Hash,
      this.context,
      standardGovernorAbi,
      'Standard',
    )

    this.zeroGovernor = new Governor(
      governors.zeroGovernor as Hash,
      this.context,
      zeroGovernorAbi,
      'Zero',
    )

    this.emergencyGovernor = new Governor(
      governors.emergencyGovernor as Hash,
      this.context,
      emergencyGovernorAbi,
      'Emergency',
    )
  }
}
