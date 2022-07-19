import React from 'react';
import Loader from 'react-js-loader';

export default function Spinner() {
  return (
    <div className="spinner-container">
      <Loader type="bubble-loop" bgColor="rgb(24, 144, 255)" size={100} />
    </div>
  );
}
