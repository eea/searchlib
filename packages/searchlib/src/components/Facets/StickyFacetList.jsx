import React from 'react';
import { useAtom } from 'jotai';
import { Button, Card, Dimmer, Icon, Sticky } from 'semantic-ui-react';
// import { Checkbox, Grid, Menu, Segment, Sidebar } from 'semantic-ui-react';

import { ModalFacetWrapper } from '@eeacms/search/components';
import { bodyContentRefAtom, showFacetsAsideAtom } from '@eeacms/search/state';
import { useWindowDimensions, useSearchContext } from '@eeacms/search/lib/hocs';

import FacetsList from './FacetsList';
import MoreLikeThis from './Connected/MoreLikeThis';
import { ErrorBoundary } from '@elastic/react-search-ui';

const DimmerFacets = () => {
  const [active, setActive] = React.useState(false);
  const [showFacets] = useAtom(showFacetsAsideAtom);

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
                <Card.Group stackable itemsPerRow={1}>
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

const NormalFacets = () => {
  const [bodyRef] = useAtom(bodyContentRefAtom);
  const [showFacets, setShowFacets] = useAtom(showFacetsAsideAtom);
  const { width } = useWindowDimensions();
  const isActive = width > 766;
  // const searchContext = useSearchContext();
  // const hasFilters = searchContext.filters.length > 0;

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
              <Card.Group stackable itemsPerRow={1}>
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

export default () => {
  const [, setShowFacets] = useAtom(showFacetsAsideAtom);
  const { width } = useWindowDimensions();

  const isSmallScreen = width <= 766;
  const searchContext = useSearchContext();
  const hasFilters = searchContext.filters.length > 0;

  React.useEffect(() => {
    if (hasFilters) setShowFacets(true);
  }, [hasFilters, setShowFacets]);

  return isSmallScreen ? <DimmerFacets /> : <NormalFacets />;
};
