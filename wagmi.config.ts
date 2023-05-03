import { defineConfig } from '@wagmi/cli'
import { foundry, actions } from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'src/generated.ts',
  contracts: [],
  plugins: [
    foundry({
      project: '../SPOG',
      deployments: {
        SPOGFactory: {
          11155111: '0xA1CE7Bb1C5a9459663Abf8833EC8071296FA0791',
          31337: '0x4826533B4897376654Bb4d4AD88B7faFD0C98528',
        },
      },
    }),
    actions(),
  ],
})
