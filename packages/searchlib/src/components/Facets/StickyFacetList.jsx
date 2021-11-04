import React from 'react';
import FacetsList from './FacetsList';
import MoreLikeThis from './MoreLikeThis';
import { Button, Card, Icon, Sticky } from 'semantic-ui-react';
import { ModalFacetWrapper } from '@eeacms/search/components';
import { useAtom } from 'jotai';
import { bodyContentRefAtom } from '@eeacms/search/state';
import { showFacetsAsideAtom } from '@eeacms/search/state';

export default (props) => {
  const [bodyRef] = useAtom(bodyContentRefAtom);
  const [showFacets, setShowFacets] = useAtom(showFacetsAsideAtom);

  return (
    <Sticky context={bodyRef}>
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
        {showFacets ? 'Hide filters' : 'Show more filters'}
      </Button>
    </Sticky>
  );
};
