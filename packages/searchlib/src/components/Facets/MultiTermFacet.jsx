import React from 'react';
import { withSearch } from '@elastic/react-search-ui';
import { Icon } from 'semantic-ui-react';
import cx from 'classnames';
import { Resizable, ToggleSort } from '@eeacms/search/components';
import { useSort } from '@eeacms/search/lib/hocs';

function getFilterValueDisplay(filterValue) {
  if (filterValue === undefined || filterValue === null) return '';
  if (filterValue.hasOwnProperty('name')) return filterValue.name;
  return String(filterValue);
}
const FacetOptions = (props) => {
  const { sortedOptions, label, onSelect, onRemove } = props;
  return (
    <div className="sui-multi-checkbox-facet">
      {sortedOptions.map((option) => {
        const checked = option.selected;
        return (
          <label
            key={`${getFilterValueDisplay(option.value)}`}
            htmlFor={`multiterm_facet_${label}${getFilterValueDisplay(
              option.value,
            )}`}
            className="sui-multi-checkbox-facet__option-label"
          >
            <div className="sui-multi-checkbox-facet__option-input-wrapper">
              <input
                id={`multiterm_facet_${label}${getFilterValueDisplay(
                  option.value,
                )}`}
                type="checkbox"
                className="sui-multi-checkbox-facet__checkbox"
                checked={checked}
                onChange={() =>
                  checked ? onRemove(option.value) : onSelect(option.value)
                }
              />
              <span className="sui-multi-checkbox-facet__input-text">
                {getFilterValueDisplay(option.value)}
              </span>
            </div>
            <span className="sui-multi-checkbox-facet__option-count">
              {option.count.toLocaleString('en')}
            </span>
          </label>
        );
      })}
    </div>
  );
};

const Select = ({ options, value, onChange, className }) => {
  const handler = (e) => onChange(e.target.value);
  // console.log('value', value);

  return (
    <select
      onBlur={handler}
      onChange={handler}
      value={value}
      className={className}
    >
      {options.map((opt) => (
        <option value={opt.value} key={opt.key}>
          {opt.text}
        </option>
      ))}
    </select>
  );
};

const ViewComponent = (props) => {
  const {
    className,
    label,
    onMoreClick,
    onRemove,
    onSelect,
    options,
    showMore,
    showSearch,
    onSearch,
    searchPlaceholder,
    onChangeFilterType,
    filterType = 'any',
  } = props;

  const filterTypes = [
    { key: 2, text: 'Match any', value: 'any' },
    { key: 1, text: 'Match all', value: 'all' },
  ];

  // const sortedOptions = sorted(options, sortOn, sortOrder);

  const { sortedValues: sortedOptions, toggleSort, sorting } = useSort(
    options,
    ['value', 'count'],
    {
      defaultSortOn: 'count',
      defaultSortOrder: 'descending',
    },
  );

  return (
    <fieldset className={cx('sui-facet searchlib-multiterm-facet', className)}>
      <legend className="sui-facet__title">{label}</legend>

      {showSearch && (
        <div className="sui-facet-search">
          <Icon name="search" size="small" color="blue" />
          <input
            className="sui-facet-search__text-input"
            type="search"
            placeholder={searchPlaceholder || 'Search'}
            onChange={(e) => {
              onSearch(e.target.value);
            }}
          />
        </div>
      )}

      {options.length < 1 && <div>No matching options</div>}

      <div className="sui-multi-checkbox-facet facet-term-controls">
        <div className="sui-multi-checkbox-facet__option-label">
          <div className="sui-multi-checkbox-facet__option-input-wrapper">
            <div className="sui-multi-checkbox-facet__checkbox"></div>
            <span className="sui-multi-checkbox-facet__input-text">
              <ToggleSort
                label={label}
                onToggle={() => toggleSort('value')}
                on={sorting.sortOn === 'value'}
                icon={
                  sorting.sortOrder === 'ascending' ? (
                    <Icon name="sort alphabet ascending" />
                  ) : (
                    <Icon name="sort alphabet descending" />
                  )
                }
              >
                <Select
                  className="match-select"
                  value={filterType}
                  options={filterTypes}
                  onChange={onChangeFilterType}
                />
              </ToggleSort>
            </span>
          </div>
          <span className="sui-multi-checkbox-facet__option-count">
            <ToggleSort
              label="Count"
              onToggle={() => toggleSort('count')}
              on={sorting.sortOn === 'count'}
              icon={
                sorting.sortOrder === 'ascending' ? (
                  <Icon name="sort numeric ascending" />
                ) : (
                  <Icon name="sort numeric descending" />
                )
              }
            />
          </span>
        </div>
      </div>
      <Resizable>
        <FacetOptions
          sortedOptions={sortedOptions}
          label={label}
          onSelect={onSelect}
          onRemove={onRemove}
        />
      </Resizable>

      {showMore && (
        <button
          type="button"
          className="sui-facet-view-more"
          onClick={onMoreClick}
          aria-label="Show more options"
        >
          + More
        </button>
      )}
    </fieldset>
  );
};

const MultiTypeFacetComponent = (props) => {
  // console.log('facet props', props);
  const { field, addFilter, removeFilter, filters } = props;
  const [filterType, setFilterType] = React.useState('any');
  const filterValue = filters.find((f) => f.field === field);
  return (
    <ViewComponent
      filterType={filterType}
      onChangeFilterType={(filterType) => {
        if (!filterValue) {
          setFilterType(filterType);
          return;
        }
        removeFilter(field);
        const { values = [] } = filterValue || {};
        values.forEach((v) => {
          addFilter(filterValue.field, v, filterType);
        });
        setFilterType(filterType);
      }}
      {...props}
    />
  );

  // return (
  //   <FacetWrapper
  //     {...props}
  //     filterType={filterType}
  //     show={100000}
  //     view={(props) => (
  //     )}
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
)(MultiTypeFacetComponent);
