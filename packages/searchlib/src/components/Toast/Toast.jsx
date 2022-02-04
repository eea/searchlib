import React from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { toast } from 'react-toastify';

const Toast = ({ level = 'warning', children }) => {
  useDeepCompareEffect(() => {
    const action = toast[level];
    action(<div>{children}</div>);
  }, [children, level]);
  return null;
};

export default Toast;
