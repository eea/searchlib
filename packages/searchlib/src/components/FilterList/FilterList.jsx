import React from 'react';
import { Divider, Segment, Accordion, Button, Icon } from 'semantic-ui-react';
import Filter from './Filter';

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
