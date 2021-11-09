import React from 'react';
import cx from 'classnames';
import { Resizable } from '@eeacms/search/components'; // , FacetWrapper
import { Button } from 'semantic-ui-react'; // , Header, Image
import { useAppConfig } from '@eeacms/search/lib/hocs';

function getFilterValueDisplay(filterValue) {
  if (filterValue === undefined || filterValue === null) return '';
  if (filterValue.hasOwnProperty('name')) return filterValue.name;
  return String(filterValue);
}

const FacetOptions = (props) => {
  const { options, label, onSelect, onRemove } = props;
  return (
    <div className="sui-multi-checkbox-facet">
      {options.map((option) => {
        const checked = option.selected;
        return (
          <Button
            key={`${getFilterValueDisplay(option.value)}`}
            className="term"
            toggle
            active={checked}
            onClick={() =>
              //              checked ? onRemove(option.value) : onSelect(option.value)
              options.forEach((opt) => {
                if (opt.value.name === option.value.name) {
                  onSelect(opt.value);
                } else {
                  onRemove(opt.value);
                }
              })
            }
            //onRemove={() => onRemove(option.value)}
          >
            <span className="title">{getFilterValueDisplay(option.value)}</span>
            <span className="count">{option.count.toLocaleString('en')}</span>
          </Button>
        );
      })}
    </div>
  );
};

const ViewComponent = (props) => {
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
        {options.length < 1 && <div>No matching options</div>}

        <FacetOptions
          options={options}
          label={label}
          facets={facets}
          onSelect={onSelect}
          onRemove={onRemove}
        />
      </ContentWrapper>
    </>
  );
};

const ModalFixedRangeFacetComponent = (props) => {
  //<FacetWrapper {...props} view={(props) => } />
  return <ViewComponent {...props} />;
};

export default ModalFixedRangeFacetComponent;

// import { withSearch } from '@elastic/react-search-ui';
// export default withSearch(
//   ({ filters, facets, addFilter, removeFilter, setFilter, a11yNotify }) => ({
//     filters,
//     facets,
//     addFilter,
//     removeFilter,
//     setFilter,
//     a11yNotify,
//   }),
// )(ModalFixedRangeFacetComponent);
