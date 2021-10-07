import React from 'react';
import { withSearch } from '@elastic/react-search-ui';
import cx from 'classnames';
import { Resizable } from '@eeacms/search/components'; // , FacetWrapper
import { Button } from 'semantic-ui-react'; // , Header, Image

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
            <span class="title">{getFilterValueDisplay(option.value)}</span>
            <span class="count">{option.count.toLocaleString('en')}</span>
          </Button>
        );
      })}
    </div>
  );
};

const ViewComponent = (props) => {
  const { className, label, onRemove, onSelect, options, facets } = props;
  return (
    <fieldset className={cx('sui-facet searchlib-fixedrange-facet', className)}>
      <legend className="sui-facet__title">{label}</legend>

      {options.length < 1 && <div>No matching options</div>}

      <Resizable>
        <FacetOptions
          options={options}
          label={label}
          facets={facets}
          onSelect={onSelect}
          onRemove={onRemove}
        />
      </Resizable>
    </fieldset>
  );
};

const ModalFixedRangeFacetComponent = (props) => {
  //<FacetWrapper {...props} view={(props) => } />
  return <ViewComponent {...props} />;
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
)(ModalFixedRangeFacetComponent);
