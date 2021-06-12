import React from 'react';
import { Grid, Segment, Container } from 'semantic-ui-react';

const RightColumnLayout = (props) => {
  const { bodyContent, bodyFooter, bodyHeader, header, sideContent } = props;
  console.log('right', props);
  return (
    <div>
      <div className="sui-layout-header">
        <div className="sui-layout-header__inner">{header}</div>
      </div>

      <Grid columns={2} container stackable className="body-content">
        <Grid.Row>
          <Grid.Column widescreen="12">
            <div>{bodyHeader}</div>
            <div>{bodyContent}</div>
          </Grid.Column>
          <Grid.Column widescreen="4">
            <div>{sideContent}</div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Grid>
        <div>{bodyFooter}</div>
      </Grid>
    </div>
  );
};

export default RightColumnLayout;
