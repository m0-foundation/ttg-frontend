import { Config } from '@wagmi/core'

export const useWagmiConfig = () => {
  const nuxtApp = useNuxtApp()
  // use the same wagmi config as  use-wagmi
  const config: Config = nuxtApp.vueApp._context.provides['use-wagmi-config']
  return config
}
