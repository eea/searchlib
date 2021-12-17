import React from 'react';
import { useAtom } from 'jotai';
import { Button, Card, Dimmer, Icon, Sticky } from 'semantic-ui-react';
import { Checkbox, Grid, Menu, Segment, Sidebar } from 'semantic-ui-react';

import { ModalFacetWrapper } from '@eeacms/search/components';
import { bodyContentRefAtom, showFacetsAsideAtom } from '@eeacms/search/state';
import { useWindowDimensions, useSearchContext } from '@eeacms/search/lib/hocs';

import FacetsList from './FacetsList';
import MoreLikeThis from './Connected/MoreLikeThis';
import { ErrorBoundary } from '@elastic/react-search-ui';

const DimmerFacets = (props) => {
  const [active, setActive] = React.useState(false);
  const [showFacets, setShowFacets] = useAtom(showFacetsAsideAtom);

  return (
    <div>
      <Dimmer active={active} verticalAlign="top" page className="facet-dimmer">
        {showFacets ? (
          <>
            <ErrorBoundary>
              <MoreLikeThis />
            </ErrorBoundary>
            <FacetsList
              defaultWraper={ModalFacetWrapper}
              view={({ children }) => (
                <Card.Group {...props} stackable itemsPerRow={1}>
                  {children}
                </Card.Group>
              )}
            />
          </>
        ) : (
          ''
        )}

        <Button.Group>
          <Button
            className="show-filters"
            toggle
            onClick={() => {
              setActive(false);
            }}
          >
            <Icon name="filter" />
            Hide Filters
          </Button>
        </Button.Group>
      </Dimmer>

      <Button.Group>
        <Button
          className="show-filters"
          toggle
          onClick={() => {
            setActive(true);
          }}
        >
          <Icon name="filter" />
          Filters
        </Button>
      </Button.Group>
    </div>
  );
};

const NormalFacets = (props) => {
  const [bodyRef] = useAtom(bodyContentRefAtom);
  const [showFacets, setShowFacets] = useAtom(showFacetsAsideAtom);
  const { width } = useWindowDimensions();
  const isActive = width > 766;
  const searchContext = useSearchContext();
  const hasFilters = searchContext.filters.length > 0;

  return (
    <Sticky context={bodyRef} active={isActive}>
      {showFacets ? (
        <>
          <ErrorBoundary>
            <MoreLikeThis />
          </ErrorBoundary>
          <FacetsList
            defaultWraper={ModalFacetWrapper}
            view={({ children }) => (
              <Card.Group {...props} stackable itemsPerRow={1}>
                {children}
              </Card.Group>
            )}
          />
        </>
      ) : (
        ''
      )}
      <Button
        className="show-filters"
        toggle
        active={showFacets}
        onClick={() => {
          setShowFacets(!showFacets);
        }}
      >
        <Icon name="filter" />
        {showFacets ? 'Hide filters' : 'Filters'}
      </Button>
    </Sticky>
  );
};

export default (props) => {
  const [bodyRef] = useAtom(bodyContentRefAtom);
  const [showFacets, setShowFacets] = useAtom(showFacetsAsideAtom);
  const { width } = useWindowDimensions();
  const isActive = width > 766;
  const isSmallScreen = width < 600;
  const searchContext = useSearchContext();
  const hasFilters = searchContext.filters.length > 0;
  const enableDimmer = true; // WIP - true to see the changes on small screen

  React.useEffect(() => {
    if (hasFilters) setShowFacets(true);
  }, [hasFilters, setShowFacets]);

  return (
    <>
      {isSmallScreen && enableDimmer ? (
        <DimmerFacets props={props} />
      ) : (
        <NormalFacets props={props} />
      )}
    </>
  );
};
