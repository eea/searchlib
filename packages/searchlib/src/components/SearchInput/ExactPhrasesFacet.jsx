import React from 'react';
import { withSearch, Facet as SUIFacet } from '@elastic/react-search-ui';
import { Radio } from 'semantic-ui-react';
import { EXACT_PHRASES } from '@eeacms/search/constants';

export const ExactPhrasesFacetComponent = (props) => {
  // console.log('props', props);

  const { setFilter, filters } = props;
  const filter = filters.find(({ field }) => field === EXACT_PHRASES);
  const value = filter ? filter.values[0] : false;

  return (
    <div id="exact-phrases-facet">
      <Radio
        toggle
        label="Exact phrases?"
        checked={value}
        onChange={(e, { checked }) => {
          setFilter('exactPhrases', checked, 'phrase search settings');
        }}
      />
    </div>
  );
};

const Facet = withSearch(
  ({ filters, facets, addFilter, removeFilter, setFilter, a11yNotify }) => ({
    filters,
    facets,
    addFilter,
    removeFilter,
    setFilter,
    a11yNotify,
  }),
)(ExactPhrasesFacetComponent);

export default Facet;
