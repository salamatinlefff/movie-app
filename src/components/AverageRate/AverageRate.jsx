import React from 'react';
import PropTypes from 'prop-types';

export default function AverageRate({ average }) {
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

  const averageRate = parseInt(average, 10) ? average.toFixed(1) : 'N/A';

  return (
    <span className="item__grade" style={{ borderColor: averageColor(average) }}>
      {averageRate}
    </span>
  );
}

AverageRate.propTypes = {
  average: PropTypes.number.isRequired,
};
