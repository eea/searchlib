import React from 'react';
import { useAtom } from 'jotai';
import { Button, Card, Icon, Sticky } from 'semantic-ui-react';

import { ModalFacetWrapper } from '@eeacms/search/components';
import { bodyContentRefAtom, showFacetsAsideAtom } from '@eeacms/search/state';
import { useWindowDimensions, useSearchContext } from '@eeacms/search/lib/hocs';

import FacetsList from './FacetsList';
import MoreLikeThis from './Connected/MoreLikeThis';

export default (props) => {
  const [bodyRef] = useAtom(bodyContentRefAtom);
  const [showFacets, setShowFacets] = useAtom(showFacetsAsideAtom);
  const { width } = useWindowDimensions();
  const isActive = width > 766;
  const searchContext = useSearchContext();
  const hasFilters = searchContext.filters.length > 0;

  React.useEffect(() => {
    if (hasFilters) setShowFacets(true);
  }, [hasFilters, setShowFacets]);

  return (
    <Sticky context={bodyRef} active={isActive}>
      {showFacets ? (
        <>
          <MoreLikeThis />
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
