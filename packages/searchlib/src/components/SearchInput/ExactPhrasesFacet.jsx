import React from 'react';
import { withSearch } from '@elastic/react-search-ui';
import { Radio } from 'semantic-ui-react';
import { EXACT_PHRASES } from '@eeacms/search/constants';

const truthy = (val) => {
  if (typeof val === 'string') {
    return val === 'true' ? true : false;
  }
  return val;
};

export const ExactPhrasesFacetComponent = (props) => {
  const { setFilter, filters, removeFilter } = props;
  const filter = filters.find(({ field }) => field === EXACT_PHRASES);
  const value = filter ? truthy(filter.values[0]) : false;

  return (
    <div id="exact-phrases-facet">
      <Radio
        toggle
        label="Exact phrases?"
        checked={value}
        onChange={(e, { checked }) => {
          if (checked) {
            setFilter('exactPhrases', checked, 'none');
          } else {
            removeFilter('exactPhrases');
          }
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
