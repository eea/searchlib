import React from 'react';
import { getRangeStartEnd } from '@eeacms/search/lib/utils';
import { Input } from 'semantic-ui-react';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { HistogramSlider } from '@eeacms/search/components/Vis';

const visualStyle = {
  selectedColor: '#55cee4',
  unselectedColor: '#e8e8e8',
  trackColor: '#00548a',
};

const HistogramFacetComponent = (props) => {
  const { data, ranges, onChange, selection, step } = props;

  const range = getRangeStartEnd(ranges);
  const {
    start = selection ? selection[0] : undefined ?? range.start,
    end = selection ? selection[1] : undefined ?? range.end,
  } = props;

  return (
    <div className="histogram-facet">
      <div className="text-input">
        <Input
          type="number"
          value={start}
          onChange={(e, { value }) =>
            onChange({ from: value, to: selection?.[1] })
          }
          min={range.start}
          max={range.end}
          step={step}
          disabled
        />
        <Input
          type="number"
          value={end}
          onChange={(e, { value }) =>
            onChange({ from: selection?.[0], to: value })
          }
          min={range.start}
          max={range.end}
          step={step}
          disabled
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
  );
};

const ModalHistogramFacet = (props) => {
  const { title } = props;

  const { HeaderWrapper = 'div', ContentWrapper = 'div' } = props;

  return (
    <>
      <HeaderWrapper>
        <div className="fixedrange__facet__header">
          <div className="facet-title">
            <h3>{title}</h3>
          </div>
        </div>
      </HeaderWrapper>
      <ContentWrapper>
        <HistogramFacetComponent {...props} />
      </ContentWrapper>
    </>
  );
};

const HistogramFacet = (props) => {
  const { facets, filters, field, onSelect, state } = props; // , filters
  const filterValue = filters.find((f) => f.field === field);

  // copied from react-search-ui/Facet.jsx
  // By using `[0]`, we are currently assuming only 1 facet per field. This
  // will likely be enforced in future version, so instead of an array, there
  // will only be one facet allowed per field.
  const facetsForField = facets[field];
  const facet = facetsForField?.[0] || {};

  const value = state?.length
    ? [state[0].from, state[0].to]
    : filterValue
    ? [filterValue.values?.[0]?.from, filterValue.values?.[0]?.to]
    : null;

  const { appConfig } = useAppConfig();
  const facetConfig = appConfig.facets.find((f) => f.field === field);

  return props.active && facet?.data ? (
    <ModalHistogramFacet
      {...props}
      data={facet?.data}
      selection={value}
      title={facetConfig?.title || props.label}
      onChange={({ to, from }) => {
        // onSelect([], true);
        if (to || from) {
          onSelect([{ to, from, type: 'range' }], true);
        } else {
          onSelect([], true);
        }
      }}
    />
  ) : null;
};

export default HistogramFacet;
