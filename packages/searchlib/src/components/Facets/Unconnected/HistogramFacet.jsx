import React from 'react';
import { ResponsiveHistogramChart } from '@eeacms/search/components/Vis';
import { RangeSlider } from '@eeacms/search/components';
import { getRangeStartEnd } from '@eeacms/search/lib/utils';
// import { withSearch } from '@elastic/react-search-ui';
import { Input } from 'semantic-ui-react';
import { useAppConfig } from '@eeacms/search/lib/hocs';

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

const ViewComponent = (props) => {
  const { data, ranges, onChange } = props;

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
  const {
    className,
    label,
    onRemove,
    onSelect,
    options,
    facets,
    field,
    HeaderWrapper = 'div',
    ContentWrapper = 'div',
  } = props;
  const { appConfig } = useAppConfig();
  const facetConfig = appConfig.facets.find((f) => f.field === field);
  return (
    <>
      <HeaderWrapper>
        <div className="fixedrange__facet__header">
          <div className="facet-title">
            <h3>{facetConfig?.title || label}</h3>
          </div>
        </div>
      </HeaderWrapper>
      <ContentWrapper>
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
      </ContentWrapper>
    </>
  );
};

export const HistogramFacetComponent = (props) => {
  return <ViewComponent {...props} />;
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
};

export default HistogramFacet;

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
// export default withSearch(
//   ({ filters, facets, addFilter, removeFilter, setFilter, a11yNotify }) => ({
//     filters,
//     facets,
//     addFilter,
//     removeFilter,
//     setFilter,
//     a11yNotify,
//   }),
// )(HistogramFacet);
