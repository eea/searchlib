import React from 'react';
import { Button, Label, Icon } from 'semantic-ui-react';

export const FilterValue = ({ value }) => {
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    if (value.type === 'range') {
      return `${value.from} - ${value.to}`;
    }
    if (value.rangeType === 'fixed') {
      return `${value.name}`;
    }
  }

  // eslint-disable-next-line no-console
  console.warn('Unknown value type', value);

  return value.toString();
};

const Filter = (props) => {
  const { field, type, values, onClear, removeFilter } = props;

  return (
    <div className="filter-list-item">
      <div className="filter-name">
        {`${field} ${type !== 'none' ? `(${type})` : ''}:`}
      </div>
      <Label.Group>
        {values?.map((v, index) => {
          return (
            <Label key={index}>
              <FilterValue value={v} />
              <Icon
                onClick={() => {
                  return values.length === 1
                    ? onClear(field)
                    : removeFilter(field, v, type);
                }}
                name="delete"
              />
            </Label>
          );
        })}
      </Label.Group>
    </div>
  );
};

const FilterList = (props) => {
  const { filters, clearFilters, setFilter, removeFilter } = props;
  return (
    <div className="filter-list">
      <div className="filter-list-header"></div>
      <div className="filter-list-content">
        {filters.map((filter, index) => {
          return (
            <Filter
              key={index}
              {...filter}
              setFilter={setFilter}
              removeFilter={removeFilter}
              onClear={(field) => {
                const activeFilters = filters.map(({ field }) => field);
                const exclude = activeFilters.filter((name) => name !== field);
                clearFilters(exclude);
              }}
            />
          );
        })}
      </div>
      <div className="filter-list-footer">
        {filters?.length ? (
          <Button compact size="mini" onClick={() => clearFilters()}>
            <Icon name="delete" />
            Clear filters
          </Button>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default FilterList;
