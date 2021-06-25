import React from 'react';
import { ResponsiveHistogramChart } from '../Vis';
import { Facet, RangeSlider } from '@eeacms/search/components';
import { getRangeStartEnd } from '@eeacms/search/lib/utils';
import { withSearch } from '@elastic/react-search-ui';
import { Input } from 'semantic-ui-react';

export const HistogramFacetComponent = (props) => {
  const { data, ranges } = props;
  const range = getRangeStartEnd(ranges);
  const { start = range.start, end = range.end, step = 1 } = props;

  const [rangeStart, setRangeStart] = React.useState(start);
  const [rangeEnd, setRangeEnd] = React.useState(end);

  const timeoutRef = React.useRef();

  const onChange = React.useCallback((value, { triggeredByUser }) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setRangeStart(value[0]);
      setRangeEnd(value[1]);
    }, 300);
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  const settings = {
    min: start,
    max: end,
    step,
  };

  // console.log('props', { props, rangeStart, rangeEnd });
  return (
    <div className="histogram-facet">
      <div className="text-input">
        <Input value={rangeStart} onChange={(e, v) => setRangeStart(v)} />
        <Input value={rangeEnd} onChange={(e, v) => setRangeEnd(v)} />
      </div>
      <ResponsiveHistogramChart
        {...props}
        data={data}
        activeRange={[rangeStart, rangeEnd]}
      />
      <RangeSlider
        value={[rangeStart, rangeEnd]}
        multiple
        color="red"
        settings={{ ...settings, onChange }}
      />
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

  return (
    <Facet
      {...props}
      filterType="any"
      show={100000}
      view={(props) =>
        // only show facet when toggled, to allow rangeslider to work properly
        props.active && facet?.data ? (
          <HistogramFacetComponent {...props} data={facet?.data} />
        ) : null
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
