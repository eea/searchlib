import React from 'react';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import {
  Divider,
  Segment,
  Accordion,
  Button,
  Label,
  Icon,
} from 'semantic-ui-react';

export const FilterValue = (props) => {
  const { value, field, appConfig, registry } = props;
  const factoryName = appConfig.filters[field]?.factories?.filterList;
  if (factoryName) {
    const Component = registry.resolve[factoryName].component;
    return <Component {...props} />;
  }

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
  const { appConfig, registry } = useAppConfig();

  return (
    <div className="filter-list-item">
      <div className="filter-name">
        {`${field} ${type !== 'none' ? `(${type})` : ''}:`}
      </div>
      <Label.Group>
        {values?.map((v, index) => {
          return (
            <Label key={index}>
              <FilterValue
                value={v}
                field={field}
                type={type}
                appConfig={appConfig}
                registry={registry}
              />
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
  const [isOpened, setIsOpened] = React.useState(false);

  return filters.length ? (
    <Segment inverted className="filter-list">
      <Accordion inverted>
        <Accordion.Title
          className="filter-list-header"
          active={isOpened}
          onClick={() => setIsOpened(!isOpened)}
        >
          <Button
            floated="right"
            compact
            basic
            inverted
            size="mini"
            onClick={() => clearFilters()}
          >
            <Icon name="eraser" />
            Clear filters
          </Button>
          <div>
            <Icon name="dropdown" />
            Current filters applied: {filters.length}
          </div>
        </Accordion.Title>
        <Accordion.Content className="filter-list-content" active={isOpened}>
          <Divider inverted />
          <div className="filter">
            {filters.map((filter, index) => {
              return (
                <Filter
                  key={index}
                  {...filter}
                  setFilter={setFilter}
                  removeFilter={removeFilter}
                  onClear={(field) => {
                    const activeFilters = filters.map(({ field }) => field);
                    const exclude = activeFilters.filter(
                      (name) => name !== field,
                    );
                    clearFilters(exclude);
                  }}
                />
              );
            })}
            <div className="filter-list-footer"></div>
          </div>
        </Accordion.Content>
      </Accordion>
    </Segment>
  ) : null;
};

export default FilterList;
