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

  return { powerDelegates, zeroDelegates };
};
