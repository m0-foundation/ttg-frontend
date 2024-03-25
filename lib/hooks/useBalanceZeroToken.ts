import { storeToRefs } from "pinia";
import { Hash } from "viem";
import { useBalance } from "use-wagmi";
import { useSpogStore } from "@/stores/spog";

export default (
  userAccount:
    | globalThis.Ref<undefined>
    | globalThis.Ref<`0x${string}`>
    | globalThis.Ref<`0x${string}` | undefined>,
) => {
  const store = useSpogStore();
  const spog = storeToRefs(store);
  // keep the reactivity alive
  const account = ref(userAccount);

  return useBalance({
    address: account,
    token: spog.contracts.value.zeroToken as Hash,
    //     watch: true,
    query: {
      enabled: true,
    },
  });
};
