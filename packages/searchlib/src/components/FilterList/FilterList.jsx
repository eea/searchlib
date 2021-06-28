import React from 'react';
import { Button, Label, Icon } from 'semantic-ui-react';

export const FilterValue = ({ value }) => {
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    if (value.type === 'range') {
      return `${value.from} - ${value.to}`;
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
      {`${field} (${type}):`}
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
  console.log('filters', filters);
  return (
    <div className="filter-list">
      <div className="filter-list-header">
        {filters?.length ? (
          <Button compact onClick={() => clearFilters()}>
            <Icon name="delete" />
            Clear filters
          </Button>
        ) : (
          ''
        )}
      </div>
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
      <div className="filter-list-footer"></div>
    </div>
  );
};

export default FilterList;
