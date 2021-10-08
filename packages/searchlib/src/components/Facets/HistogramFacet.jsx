import React from 'react';
import { ResponsiveHistogramChart } from '../Vis';
import { RangeSlider } from '@eeacms/search/components';
import { getRangeStartEnd } from '@eeacms/search/lib/utils';
import { withSearch } from '@elastic/react-search-ui';
import { Input } from 'semantic-ui-react';

function toFloat(value) {
  try {
    return parseFloat(value);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Error in parsing float', value);
    return value;
  }
}

function extractNumeric(value) {
  if (typeof value === 'string') {
    return toFloat(value);
  }
  if (value && typeof value === 'object') {
    return toFloat(value.value);
  }

  return value;
}

export const HistogramFacetComponent = (props) => {
  const { data, ranges, onChange, rangeType } = props;

  if (rangeType === 'closed') {
    if (ranges[0].from === undefined) {
      ranges.shift();
    }
    if (ranges[ranges.length - 1].to === undefined) {
      ranges.pop();
    }
    if (data[0].config.from === undefined) {
      data.shift();
    }
    if (data[data.length - 1].config.to === undefined) {
      data.pop();
    }
  }
  const range = getRangeStartEnd(ranges);
  const { start = range.start, end = range.end, step = 1 } = props;

  const [rangeStart, setRangeStart] = React.useState(start);
  const [rangeEnd, setRangeEnd] = React.useState(end);

  const settings = {
    min: range.start,
    max: range.end,
    step,
  };

  const timeoutRef = React.useRef();

  const onChangeValue = React.useCallback(
    (value, { triggeredByUser }) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        const start = extractNumeric(value[0]);
        const end = extractNumeric(value[1]);
        setRangeStart(start);
        setRangeEnd(end);
        let val = {};
        if (settings.min !== start) {
          val.from = start;
        }
        if (settings.max !== end) {
          val.to = end;
        }
        onChange(val);
      }, 300);
      return () => timeoutRef.current && clearTimeout(timeoutRef.current);
    },
    [onChange, settings.max, settings.min],
  );

  return (
    <div className="histogram-facet">
      <div className="text-input">
        <Input
          type="number"
          value={rangeStart}
          onChange={(e, { value }) => setRangeStart(value)}
          min={start}
          max={end}
        />
        <Input
          type="number"
          value={rangeEnd}
          onChange={(e, { value }) => setRangeEnd(value)}
          min={start}
          max={end}
        />
      </div>
      <ResponsiveHistogramChart
        {...props}
        data={data}
        activeRange={[rangeStart, rangeEnd]}
      />
      <RangeSlider
        value={[Math.max(rangeStart, start), Math.min(rangeEnd, end)]}
        multiple
        color="red"
        settings={{ ...settings, onChange: onChangeValue }}
      />
    </div>
  );
};

const HistogramFacet = (props) => {
  const { facets, field, options, onSelect } = props; // , filters
  // const initialStart = initialValue?.[0]?.from;
  // const initialEnd = initialValue?.[0]?.to;
  // const filterValue = filters.find((f) => f.field === field);

  // copied from react-search-ui/Facet.jsx
  // By using `[0]`, we are currently assuming only 1 facet per field. This will likely be enforced
  // in future version, so instead of an array, there will only be one facet allowed per field.
  const facetsForField = facets[field];
  const facet = facetsForField?.[0] || {};
  // TODO: resume work here
  // console.log('ff', facet, filters);
  return props.active && facet?.data ? (
    <HistogramFacetComponent
      {...props}
      start={options?.[0]?.from}
      end={options?.[0]?.to}
      data={facet?.data}
      onChange={({ to, from }) => {
        if (to || from) {
          onSelect([{ to, from, type: 'range' }], true);
        } else {
          onSelect([], true);
        }
        // onSetForce([{ to, from, type: 'range' }]);
        //setFilter(field, { to, from, type: 'range' });
      }}
    />
  ) : null;

  // return (
  //   <FacetWrapper
  //     {...props}
  //     filterType="any"
  //     show={100000}
  //     view={(props) =>
  //       // only show facet when toggled, to allow rangeslider to work properly
  //     }
  //   />
  // );
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
