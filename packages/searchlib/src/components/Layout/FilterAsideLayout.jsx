import React from 'react';

import { Grid, Container } from 'semantic-ui-react';
import { showFacetsAsideAtom } from './state';
import { isLandingPageAtom } from './../SearchView/state';
import { useAtom } from 'jotai';
import { SectionTabs } from '@eeacms/search/components';
import InlineFilterList from './../FilterList/InlineFilterList';
import { Ref } from 'semantic-ui-react';
import { bodyContentRefAtom } from '@eeacms/search/state';

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

  const [stateRef, setStateRef] = useAtom(bodyContentRefAtom);
  const setRef = React.useCallback(
    (ref) => {
      setStateRef(ref);
    },
    [setStateRef],
  );

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
          <Ref innerRef={setRef}>
            <Grid.Row>
              <Grid.Column widescreen="2" tablet="2" className="col-left">
                <div className={stateRef ? 'scrolled' : ''}>
                  {sideContent}
                  <InlineFilterList defaultFilters={defaultFilters} />
                </div>
              </Grid.Column>
              <Grid.Column widescreen="8" tablet="8" className="col-mid">
                <div>{bodyHeader}</div>
                <div>{bodyContent}</div>
              </Grid.Column>
              <Grid.Column widescreen="2" tablet="2" className="col-right">
                <div> </div>
              </Grid.Column>
            </Grid.Row>
          </Ref>
        </Grid>
      ) : (
        <Grid columns={2} container stackable className="body-content">
          {isLandingPage ? (
            <Grid.Row>
              <Grid.Column widescreen="12" tablet="12" className="col-full">
                <div>{bodyHeader}</div>
                <div>{bodyContent}</div>
              </Grid.Column>
            </Grid.Row>
          ) : (
            <Grid.Row>
              <Grid.Column widescreen="2" tablet="2" className="col-left">
                <InlineFilterList defaultFilters={defaultFilters} />
              </Grid.Column>
              <Grid.Column widescreen="8" tablet="8" className="col-mid">
                <div>{bodyHeader}</div>
                <div>{bodyContent}</div>
              </Grid.Column>
              <Grid.Column
                widescreen="2"
                tablet="2"
                className="col-right"
              ></Grid.Column>
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
