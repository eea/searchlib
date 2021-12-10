import React from 'react';
import LogoImage from './LogoImage';

const WebsiteFilterListComponent = (props) => {
  const { value } = props;
  // console.log('props', props);
  return (
    <span>
      <LogoImage websiteName={value} />
      {value}
    </span>
  );
};

export default WebsiteFilterListComponent;
