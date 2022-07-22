import { toast } from 'react-toastify';

function notifyMessage(type, message) {
  toast[type](message, {
    style: {
      fontSize: '17px',
      height: '100px',
    },
  });
}

export { notifyMessage };
