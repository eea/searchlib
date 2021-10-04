import React from 'react';

/**
 * A hoc that grants multi-type faceting (all/any)
 *
 */

const withMultiTypeFilter = ({ defaultType = 'any' }) => (WrappedComponent) => {
  const [filterType, setFilterType] = React.useState(defaultType);
  return (props) => (
    <WrappedComponent
      {...props}
      filterType={filterType}
      onChangeFilterType={setFilterType}
    />
  );
};

export default withMultiTypeFilter;
