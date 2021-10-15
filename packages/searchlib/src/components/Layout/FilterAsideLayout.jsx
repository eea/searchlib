import React from 'react';

import { Grid, Container } from 'semantic-ui-react';
import { showFacetsAsideAtom } from './state';
import { isLandingPageAtom } from './../SearchView/state';
import { useAtom } from 'jotai';
import { SectionTabs } from '@eeacms/search/components';
import InlineFilterList from './../FilterList/InlineFilterList';

const FilterAsideLayout = (props) => {
  const {
    bodyContent,
    bodyFooter,
    bodyHeader,
    header,
    sideContent,
    appConfig,
  } = props;
  const { defaultFilters } = appConfig;
  const [showFacets] = useAtom(showFacetsAsideAtom);
  const [isLandingPage] = useAtom(isLandingPageAtom);
  return (
    <div>
      <Container>
        <div className="sui-layout-header">
          <div className="sui-layout-header__inner">{header}</div>
        </div>
      </Container>

      <SectionTabs />
      <InlineFilterList defaultFilters={defaultFilters} />

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
            <Grid.Column widescreen="2" tablet="1">
              <div> </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      ) : (
        <Grid columns={1} container stackable className="body-content">
          {isLandingPage ? (
            <Grid.Row>
              <Grid.Column widescreen="12" tablet="12">
                <div>{bodyHeader}</div>
                <div>{bodyContent}</div>
              </Grid.Column>
            </Grid.Row>
          ) : (
            <Grid.Row>
              <Grid.Column widescreen="2" tablet="2"></Grid.Column>
              <Grid.Column widescreen="8" tablet="8">
                <div>{bodyHeader}</div>
                <div>{bodyContent}</div>
              </Grid.Column>
              <Grid.Column widescreen="2" tablet="2"></Grid.Column>
            </Grid.Row>
          )}
        </Grid>
      )}

      <Grid container className="body-footer">
        <div>{bodyFooter}</div>
      </Grid>
    </div>
  );
};

export default FilterAsideLayout;
