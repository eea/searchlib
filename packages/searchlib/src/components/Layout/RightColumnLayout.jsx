import React from 'react';
import { Grid, Container } from 'semantic-ui-react';

const RightColumnLayout = (props) => {
  const { bodyContent, bodyFooter, bodyHeader, header, sideContent } = props;
  return (
    <div>
      <Container className="layout-header">{header}</Container>

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
      <Grid container className="body-footer">
        <div>{bodyFooter}</div>
      </Grid>
    </div>
  );
};

export default RightColumnLayout;
