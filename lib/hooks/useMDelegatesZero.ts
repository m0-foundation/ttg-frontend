import { storeToRefs } from 'pinia'
import { Hash } from 'viem'
import { useReadContract } from 'use-wagmi'
import { zeroTokenAbi } from '@/lib/sdk'

export default (
  userAccount:
    | globalThis.Ref<undefined>
    | globalThis.Ref<`0x${string}`>
    | globalThis.Ref<`0x${string}` | undefined>,
) => {
  // keep the reactive from the prop alive
  const account = ref(userAccount)
  const store = useTtgStore()
  const ttg = storeToRefs(store)

  return useReadContract({
    address: ttg.contracts.value.zeroToken as Hash,
    abi: zeroTokenAbi,
    functionName: 'delegates',
    args: [account as Ref<Hash>],
    query: {
      select: (data) => {
        return String(data)
      },
    },
  })
}
