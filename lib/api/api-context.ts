import { PublicClient } from 'viem'
import { IApiConfig } from './types'

export class ApiContext {
  client: PublicClient
  config: IApiConfig

  constructor(client: PublicClient, config: IApiConfig) {
    this.client = client
    this.config = config
  }
}
