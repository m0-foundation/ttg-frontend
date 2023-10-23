import useMTokenPower from "./useMTokenPower";
import useMTokenZero from "./useMTokenZero";

export default () => {
  const powerToken = useMTokenPower();
  const zeroToken = useMTokenZero();

  return { powerToken, zeroToken };
};
