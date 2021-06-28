import React from 'react';
import BooleanFacet from '@eeacms/search/components/Facets/BooleanFacet';
import { EXACT_PHRASES } from '@eeacms/search/constants';

const ExactPhrasesFacet = (props) => (
  <BooleanFacet
    id="exact-phrases-facet"
    label="Exact phrases?"
    field={EXACT_PHRASES}
  />
);

export default ExactPhrasesFacet;
