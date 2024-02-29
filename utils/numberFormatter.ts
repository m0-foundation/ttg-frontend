export const useNumberFormatterPrice = (number: string | number | bigint) => {
  return new Intl.NumberFormat("en").format(Number(number));
};

export const useNumberFormatterCompact = (number: string | number | bigint) => {
  const nf = new Intl.NumberFormat("en", { notation: "compact" });
  const formatted = nf.format(Number(number));
  return formatted;
};
