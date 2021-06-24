import React from 'react';
import { ResponsiveHistogramChart } from '../Vis';
import { Facet } from '@eeacms/search/components';
import { withSearch } from '@elastic/react-search-ui';

const HistogramFacetComponent = (props) => {
  console.log('props HFC', props);
  const { facets, field, addFilter, removeFilter, filters } = props;
  // const filterValue = filters.find((f) => f.field === field);

  // copied from react-search-ui/Facet.jsx
  // By using `[0]`, we are currently assuming only 1 facet per field. This will likely be enforced
  // in future version, so instead of an array, there will only be one facet allowed per field.
  const facetsForField = facets[field];
  const facet = facetsForField?.[0] || {};
  const data = facet?.data?.map(({ count, value }) => ({
    x: value.name,
    y: count,
  }));
  console.log('data', data);

  return (
    <Facet
      {...props}
      filterType="any"
      show={100000}
      view={(props) => <ResponsiveHistogramChart {...props} data={data} />}
    />
  );
};

export default withSearch(
  ({ filters, facets, addFilter, removeFilter, setFilter, a11yNotify }) => ({
    filters,
    facets,
    addFilter,
    removeFilter,
    setFilter,
    a11yNotify,
  }),
)(HistogramFacetComponent);
