import React from 'react';
import FacetsList from './FacetsList';
import { Card, Sticky } from 'semantic-ui-react';
import { ModalFacetWrapper } from '@eeacms/search/components';
import { useAtom } from 'jotai';
import { bodyContentRefAtom } from '@eeacms/search/state';

export default (props) => {
  const [bodyRef] = useAtom(bodyContentRefAtom);

  return (
    <Sticky context={bodyRef}>
      <FacetsList
        defaultWraper={ModalFacetWrapper}
        view={({ children }) => (
          <Card.Group {...props} stackable itemsPerRow={1}>
            {children}
          </Card.Group>
        )}
      />
    </Sticky>
  );
};
