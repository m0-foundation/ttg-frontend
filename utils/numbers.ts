export function formatNumber(value: number | bigint | string): string {
  const number = Number(value);
  // TODO: Improve this formatter
  const formatter: Intl.NumberFormat = new Intl.NumberFormat("en-US", {
    maximumFractionDigits:
      number > 100_000
        ? 0
        : number > 1
          ? 2
          : number > 0.001
            ? 4
            : number > 0.00001
              ? 6
              : number > 0.0000001
                ? 8
                : number > 0.000000001
                  ? 10
                  : number > 0.00000000001
                    ? 12
                    : number > 0.0000000000001
                      ? 14
                      : number > 0.000000000000001
                        ? 16
                        : 18,
  });

  return formatter.format(value);
}
