import React from 'react';
import { Card, Placeholder } from 'semantic-ui-react';

const CardItem = (props) => {
  const { result } = props;
  // console.log('card props', props);
  return (
    <Card>
      <Placeholder fluid />
      <Card.Header>{result[props.titleField]?.raw}</Card.Header>
    </Card>
  );
};

export default CardItem;
