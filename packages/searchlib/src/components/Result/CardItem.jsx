import React from 'react';
import { Card, Image, Label } from 'semantic-ui-react';
import { DateTime, StringList } from '@eeacms/search';

const CardItem = (props) => {
  const { result } = props;
  // console.log('card props', props);
  return (
    <Card className="card-item">
      <Label color="green" className="meta-type">
        <StringList value={result[props.metatypeField]?.raw} />
      </Label>

      <Image
        src="https://react.semantic-ui.com/images/wireframe/white-image.png"
        wrapped
        ui={false}
        size="tiny"
        as="a"
        href={result.id?.raw}
        label={
          <>
            <Label color="yellow" ribbon="right">
              New
            </Label>
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
        </Card.Meta>
      </Card.Content>
      <Card.Content extra>
        <Card.Meta>
          <DateTime format="DATE_MED" value={result[props.issuedField]?.raw} />
        </Card.Meta>
      </Card.Content>
    </Card>
  );
};

export default CardItem;
