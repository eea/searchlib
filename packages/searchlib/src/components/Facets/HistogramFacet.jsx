import React from 'react';
import { ResponsiveHistogramChart } from '../Vis';
import { Facet, RangeSlider } from '@eeacms/search/components';
import { withSearch } from '@elastic/react-search-ui';

export const HistogramFacetComponent = (props) => {
  const { data } = props;
  const settings = {
    // start: [2, 8],
    min: 0,
    max: 10,
    step: 1,
  };
  return (
    <div className="histogram-facet">
      <ResponsiveHistogramChart {...props} data={data} />
      <RangeSlider value={[2, 8]} multiple color="red" settings={settings} />
    </div>
  );
};

const HistogramFacet = (props) => {
  // console.log('props HFC', props);
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
      view={(props) =>
        // only show facet when toggled, to allow rangeslider to work properly
        props.active ? <HistogramFacetComponent {...props} data={data} /> : null
      }
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
)(HistogramFacet);
