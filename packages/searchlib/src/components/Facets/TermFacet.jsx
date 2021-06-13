import React from 'react';
import { withSearch, Facet } from '@elastic/react-search-ui';
import cx from 'classnames';
import { Table } from 'semantic-ui-react';

function getFilterValueDisplay(filterValue) {
  if (filterValue === undefined || filterValue === null) return '';
  if (filterValue.hasOwnProperty('name')) return filterValue.name;
  return String(filterValue);
}

const Select = ({ options, value, onChange }) => {
  const handler = (e) => onChange(e.target.value);
  // console.log('value', value);

  return (
    <select onBlur={handler} onChange={handler} value={value}>
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

  // const [matchOption, setMatchOption] = React.useState('any');

  return (
    <fieldset className={cx('sui-facet', className)}>
      <legend className="sui-facet__title">{label}</legend>

      {showSearch && (
        <div className="sui-facet-search">
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

      <Select
        className="match-select"
        value={filterType}
        options={filterTypes}
        onChange={onChangeFilterType}
      />
      {options.length < 1 && <div>No matching options</div>}

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Count</Table.HeaderCell>
            <Table.HeaderCell>{label}</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {options.map((option, index) => {
            const checked = option.selected;
            return (
              <Table.Row key={index}>
                <Table.Cell>
                  <label
                    key={`${getFilterValueDisplay(option.value)}`}
                    htmlFor={`example_facet_${label}${getFilterValueDisplay(
                      option.value,
                    )}`}
                    className="sui-multi-checkbox-facet__option-label"
                  >
                    <span className="sui-multi-checkbox-facet__option-count">
                      {option.count.toLocaleString('en')}
                    </span>
                  </label>
                </Table.Cell>
                <Table.Cell>
                  <div className="sui-multi-checkbox-facet__option-input-wrapper">
                    <span className="sui-multi-checkbox-facet__input-text">
                      {getFilterValueDisplay(option.value)}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <input
                    id={`example_facet_${label}${getFilterValueDisplay(
                      option.value,
                    )}`}
                    type="checkbox"
                    className="sui-multi-checkbox-facet__checkbox"
                    checked={checked}
                    onChange={() =>
                      checked ? onRemove(option.value) : onSelect(option.value)
                    }
                  />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>

      <div className="sui-multi-checkbox-facet">
        {options.map((option) => {
          const checked = option.selected;
          return (
            <label
              key={`${getFilterValueDisplay(option.value)}`}
              htmlFor={`example_facet_${label}${getFilterValueDisplay(
                option.value,
              )}`}
              className="sui-multi-checkbox-facet__option-label"
            >
              <div className="sui-multi-checkbox-facet__option-input-wrapper">
                <input
                  id={`example_facet_${label}${getFilterValueDisplay(
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
  console.log('facet props', props);
  const { field, removeFilter, facets } = props;
  const [filterType, setFilterType] = React.useState('any');
  return (
    <Facet
      {...props}
      filterType={filterType}
      view={(props) => (
        <ViewComponent
          filterType={filterType}
          onChangeFilterType={(filterType) => {
            // when changing filter type, it resets it
            removeFilter(field);
            setFilterType(filterType);
          }}
          {...props}
        />
      )}
    />
  );
};

// const MultiTypeFacet = withMultiTypeFilter({})(MultiTypeFacetComponent);
//
// const TermFacet = MultiTypeFacet;

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
