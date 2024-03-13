// use in InputDynamic maska props based on Maska lib props: mask and tokens
export const masks = {
  seconds: {
    mask: "0",
    tokens: "0:\\d:multiple",
  },
  interger: {
    mask: "0",
    tokens: "0:\\d:multiple",
  },
  percentage: {
    mask: "0.99",
    tokens: "0:\\d:multiple|9:\\d:optional",
  },

  ethereumAddress: {
    mask: "0xH",
    tokens: "H:[0-9a-fA-F]:multiple",
  },

  eth: {
    mask: "0.999999999999999999", // 18 decimals
    tokens: "0:\\d:multiple|9:\\d:optional",
  },
};

export const maskTokenByDecimals = (decimals: number) => {
  return {
    mask: `0.${"9".repeat(decimals)}`,
    tokens: "0:\\d:multiple|9:\\d:optional",
  };
};
