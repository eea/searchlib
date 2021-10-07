import React from 'react';

import { Grid, Container } from 'semantic-ui-react';
import { showFacetsAsideAtom } from './state';
import { useAtom } from 'jotai';
import { SectionTabs } from '@eeacms/search/components';

const FilterAsideLayout = (props) => {
  const { bodyContent, bodyFooter, bodyHeader, header, sideContent } = props;
  const [showFacets] = useAtom(showFacetsAsideAtom);
  return (
    <div>
      <Container>
        <div className="sui-layout-header">
          <div className="sui-layout-header__inner">{header}</div>
        </div>
      </Container>

      <SectionTabs />

      {showFacets ? (
        <Grid columns={2} container stackable className="body-content">
          <Grid.Row>
            <Grid.Column widescreen="2" tablet="3">
              <div>{sideContent}</div>
            </Grid.Column>
            <Grid.Column widescreen="8" tablet="9">
              <div>{bodyHeader}</div>
              <div>{bodyContent}</div>
            </Grid.Column>
            <Grid.Column widescreen="2" tablet="0">
              <div> </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      ) : (
        <Grid columns={1} container stackable className="body-content">
          <Grid.Row>
            <Grid.Column widescreen="12" tablet="12">
              <div>{bodyHeader}</div>
              <div>{bodyContent}</div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}

      <Grid container className="body-footer">
        <div>{bodyFooter}</div>
      </Grid>
    </div>
  );
};

export default FilterAsideLayout;
