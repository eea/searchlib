import React from 'react';
import { Card, Image, Placeholder, Label } from 'semantic-ui-react';
import { DateTime, StringList } from '@eeacms/search';

const CardItem = (props) => {
  const { result } = props;
  console.log('card props', props);
  return (
    <Card>
      <Image
        src="https://react.semantic-ui.com/images/wireframe/white-image.png"
        wrapped
        ui={false}
        label={
          <>
            <Label color="yellow" ribbon="right">
              New
            </Label>
            {/* <Label color="green" attached> */}
            {/*   {result[props.metatypeField]?.raw} */}
            {/* </Label> */}
          </>
        }
      />
      <Card.Content>
        <Card.Meta>{result.id?.raw}</Card.Meta>
        <Card.Header>{result[props.titleField]?.raw}</Card.Header>
        <Card.Description>
          {result[props.descriptionField]?.raw}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Card.Meta>
          <StringList value={result[props.tagsField]?.raw} />
          <DateTime format="DATE_MED" value={result[props.issuedField]?.raw} />
        </Card.Meta>
      </Card.Content>
    </Card>
  );
};

export default CardItem;
