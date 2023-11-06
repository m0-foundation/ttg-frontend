export default (number: string | number | bigint) => {
  const nf = new Intl.NumberFormat("en", { notation: "compact" });
  const formatted = nf.format(Number(number));
  return formatted;
};
