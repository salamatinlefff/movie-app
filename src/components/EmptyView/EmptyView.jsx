import { Empty } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

import { ReactComponent as EmptyLogo } from './empty.svg';

export default function EmptyView({ label }) {
  return (
    <div
      style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Empty
        image={<EmptyLogo />}
        imageStyle={{
          height: 120,
        }}
        description={<span style={{ fontSize: '20px' }}>{label}</span>}
      />
    </div>
  );
}

EmptyView.defaultProps = {
  label: 'Oops! We did not find anything =(',
};

EmptyView.propTypes = {
  label: PropTypes.string,
};
