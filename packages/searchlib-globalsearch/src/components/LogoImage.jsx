import React from 'react';
import { Image } from 'semantic-ui-react';

const LogoImage = (props) => {
  const { image } = props;

  return (
    <Image className="facet-option-icon" src={require('./logos/' + image)} />
  );
};

export default LogoImage;
