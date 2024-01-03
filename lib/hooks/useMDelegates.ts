import useMDelegatesPower from "./useMDelegatesPower";
import useMDelegatesZero from "./useMDelegatesZero";

export default () => {
  const powerDelegates = useMDelegatesPower();
  const zeroDelegates = useMDelegatesZero();

  return { powerDelegates, zeroDelegates };
};
