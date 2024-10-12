export const getMonthName = ({
  monthIndex,
  locale,
  format = "long",
}: {
  monthIndex: number;
  locale: string;
  format?: "long" | "short";
}) => new Date(2024, monthIndex, 1).toLocaleString(locale, { month: format });

export const getPeriod = ({ year, month }: { year: number; month: number }) =>
  `${year}/${month < 10 ? `0${month}` : month}`;

export const getJoinedPeriod = ({
  periods,
  locale,
}: {
  periods: string[];
  locale: string;
}) => {
  const years = periods.map((period) => period.split("/")[0]);

  const isSameYear = years.every((year) => year === years[0]);

  const monthsShort = periods
    .map((period) =>
      getMonthName({
        monthIndex: parseInt(period.split("/")[1]) - 1,
        locale,
        format: "short",
      })
    )
    .map((month) => month.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

  if (years.length === 1) {
    return `${monthsShort[0]}-${years[0]}`.toUpperCase();
  }

  if (isSameYear) {
    return `${monthsShort[0]}-${monthsShort[1]} ${years[1]}`.toUpperCase();
  }

  return `${monthsShort[0]}-${years[0]} ${monthsShort[1]}-${years[1]}`.toUpperCase();
};
