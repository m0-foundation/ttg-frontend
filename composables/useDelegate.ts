import { useAccount } from "use-wagmi";
import { useMDelegates } from "@/lib/hooks";

export default () => {
  const { address: userAccount } = useAccount();
  const { powerDelegates, zeroDelegates } = useMDelegates();

  // has Delegated if the connected wallet is not the same as the delegates
  const hasDelegatedPower = computed(
    () =>
      powerDelegates?.data?.value?.toLowerCase() !==
      userAccount.value?.toLowerCase()
  );

  const hasDelegatedZero = computed(
    () =>
      zeroDelegates?.data?.value?.toLowerCase() !==
      userAccount.value?.toLowerCase()
  );

  return {
    powerDelegates: powerDelegates?.data?.value,
    zeroDelegates: zeroDelegates?.data?.value,
    hasDelegatedPower,
    hasDelegatedZero,
  };
};