import React from 'react';
import { getRangeStartEnd } from '@eeacms/search/lib/utils';
import { Input } from 'semantic-ui-react';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { HistogramSlider } from '@eeacms/search/components/Vis';

const visualStyle = {
  selectedColor: 'lightblue',
  unselectedColor: 'gray',
  trackColor: '#62819e',
};

const ViewComponent = (props) => {
  const { data, ranges, onChange, selection } = props;

  console.log('props', props);

  const range = getRangeStartEnd(ranges);
  const {
    start = selection ? selection[0] : undefined ?? range.start,
    end = selection ? selection[1] : undefined ?? range.end,
  } = props;

  // const [rangeStart, setRangeStart] = React.useState(start);
  // const [rangeEnd, setRangeEnd] = React.useState(end);

  const { label, field, HeaderWrapper = 'div', ContentWrapper = 'div' } = props;
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
              value={start}
              onChange={(e, { value }) => onChange([value, selection[1]])}
              min={start}
              max={end}
            />
            <Input
              type="number"
              value={end}
              onChange={(e, { value }) => onChange([selection[0], value])}
              min={start}
              max={end}
            />
          </div>

          <HistogramSlider
            data={data.map((d) => ({
              x0: d.value.from,
              x: d.value.to,
              y: d.count,
            }))}
            {...visualStyle}
            selection={[start, end]}
            onChange={(range) => onChange({ from: range[0], to: range[1] })}
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
  const { facets, filters, field, onSelect } = props; // , filters
  // const initialStart = initialValue?.[0]?.from;
  // const initialEnd = initialValue?.[0]?.to;
  const filterValue = filters.find((f) => f.field === field);

  // copied from react-search-ui/Facet.jsx
  // By using `[0]`, we are currently assuming only 1 facet per field. This will likely be enforced
  // in future version, so instead of an array, there will only be one facet allowed per field.
  const facetsForField = facets[field];
  const facet = facetsForField?.[0] || {};
  const value = filterValue
    ? [filterValue.values?.[0]?.from, filterValue.values?.[0]?.to]
    : null;
  // TODO: resume work here
  console.log('ff', facet, filters);
  return props.active && facet?.data ? (
    <HistogramFacetComponent
      {...props}
      data={facet?.data}
      selection={value}
      onChange={({ to, from }) => {
        onSelect([], true);
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
