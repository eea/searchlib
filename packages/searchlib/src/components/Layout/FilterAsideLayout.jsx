import React from 'react';

import { Grid, Container } from 'semantic-ui-react';
import { isLandingPageAtom } from './../SearchView/state';
import { useAtom } from 'jotai';
import { Ref } from 'semantic-ui-react';
import { bodyContentRefAtom } from '@eeacms/search/state';
import cx from 'classnames';
import { AnswersList } from '@eeacms/search/components';

const FilterAsideLayout = (props) => {
  const { bodyContent, bodyFooter, bodyHeader, header, sideContent } = props;
  const [isLandingPage] = useAtom(isLandingPageAtom);

  const [stateRef, setStateRef] = useAtom(bodyContentRefAtom);
  const setRef = React.useCallback(setStateRef, [setStateRef]);

  return (
    <div className="filter-aside-layout">
      <div className="search-header-container">
        <div className="sui-layout-header">
          <div className="sui-layout-header__inner">{header}</div>

          <Grid columns={2} stackable className="answers-section">
            <Grid.Row>
              <Grid.Column widescreen="2"></Grid.Column>
              <Grid.Column widescreen="8" className="answers-content">
                <AnswersList />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>

      <Grid columns={2} container stackable className="body-content">
        <Ref innerRef={setRef}>
          {isLandingPage ? (
            <Grid.Row>
              <Grid.Column widescreen="12" tablet="12" className="col-full">
                <div>{bodyHeader}</div>
                <div>{bodyContent}</div>
              </Grid.Column>
            </Grid.Row>
          ) : (
            <Grid.Row>
              <Grid.Column
                widescreen="2"
                tablet="2"
                computer="2"
                className="col-left"
              >
                <div className={cx({ scrolled: stateRef })}>{sideContent}</div>
              </Grid.Column>
              <Grid.Column
                widescreen="8"
                tablet="8"
                computer="10"
                className="col-mid"
              >
                <div>{bodyHeader}</div>
                <div>{bodyContent}</div>
              </Grid.Column>
              <Grid.Column
                only="computer widescreen large screen"
                widescreen="2"
                className="col-right"
              ></Grid.Column>
            </Grid.Row>
          )}
        </Ref>
      </Grid>

      <Grid container className="body-footer">
        <div>{bodyFooter}</div>
      </Grid>
    </div>
  );
};

export default FilterAsideLayout;
