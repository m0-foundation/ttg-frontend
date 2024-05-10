import { storeToRefs } from "pinia";
import { Hash } from "viem";
import { useBalance } from "use-wagmi";

export default (
  userAccount:
    | globalThis.Ref<undefined>
    | globalThis.Ref<`0x${string}`>
    | globalThis.Ref<`0x${string}` | undefined>,
) => {
  const store = useTtgStore();
  const ttg = storeToRefs(store);

  // keep the reactive from the prop alive
  const account = ref(userAccount);

  return useBalance({
    address: account,
    token: ttg.contracts.value.powerToken as Hash,
    // watch: true,
    query: {
      enabled: true,
    },
  });
};
