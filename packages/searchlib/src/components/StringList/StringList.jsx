import React from 'react';

const StringList = ({ children }) => {
  return Array.isArray(children) ? children.join(', ') : children || '';
};
export default StringList;
