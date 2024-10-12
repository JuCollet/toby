export const getRoundedFloat = ({ num }: { num: number }) =>
  Math.round(num * 100) / 100;
