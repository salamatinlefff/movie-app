import React from 'react';
import { ToastContainer } from 'react-toastify';

export function NotifyContainer() {
  return (
    <ToastContainer
      position="top-right"
      style={{ fontSize: '20px' }}
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
}
