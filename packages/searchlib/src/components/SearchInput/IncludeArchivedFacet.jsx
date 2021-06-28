import React from 'react';
import BooleanFacet from '@eeacms/search/components/Facets/BooleanFacet';
import { INCLUDE_ARCHIVED } from '@eeacms/search/constants';

const IncludeArchivedFacet = (props) => (
  <BooleanFacet
    id="archived-facet"
    label="Include archived?"
    field={INCLUDE_ARCHIVED}
  />
);

export default IncludeArchivedFacet;
