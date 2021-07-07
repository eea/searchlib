import React from 'react';
import { withSearch } from '@elastic/react-search-ui';
import { Icon } from 'semantic-ui-react';
import cx from 'classnames';
import { Facet } from '@eeacms/search/components';

const FixedRangeFacetComponent = (props) => {
  const { field, addFilter, removeFilter, filters } = props;
  const [filterType, setFilterType] = React.useState('any');
  const filterValue = filters.find((f) => f.field === field);
  return (
    <Facet
      {...props}
      show={100000}
      view={(props) => (
        <ViewComponent
          filterType={filterType}
          onChangeFilterType={(filterType) => {
            if (!filterValue) {
              setFilterType(filterType);
              return;
            }
            removeFilter(field);
            filterValue?.values?.forEach((v) => {
              addFilter(filterValue.field, v, filterType);
            });
            setFilterType(filterType);
          }}
          {...props}
        />
      )}
    />
  );
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
)(FixedRangeFacetComponent);
