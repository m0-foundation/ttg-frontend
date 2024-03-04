import useMDelegatesPower from "./useMDelegatesPower";
import useMDelegatesZero from "./useMDelegatesZero";

export default (
  userAccount:
    | globalThis.Ref<undefined>
    | globalThis.Ref<`0x${string}`>
    | globalThis.Ref<`0x${string}` | undefined>
) => {
  const powerDelegates = useMDelegatesPower(userAccount);
  const zeroDelegates = useMDelegatesZero(userAccount);

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
    powerDelegates: powerDelegates?.data,
    zeroDelegates: zeroDelegates?.data,
    hasDelegatedPower,
    hasDelegatedZero,
  };
};
