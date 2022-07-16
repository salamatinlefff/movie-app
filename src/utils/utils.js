const COLORS = {
  bad: '#E90000',
  low: '#E97E00',
  middle: '#E9D100',
  high: '#66E900',
};

const averageColor = (digit) => {
  if (digit < 3) return COLORS.bad;
  if (digit < 5) return COLORS.low;
  if (digit < 7) return COLORS.middle;
  if (digit > 7) return COLORS.high;
};

export { averageColor };
