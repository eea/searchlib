import React from 'react';

/**
 * A hoc that grants multi-type faceting (all/any)
 *
 */

const withMultiTypeFilter = (options = {}) => {
  const { defaultType = 'any' } = options;

  const decorator = (WrappedComponent) => {
    function WithWrappedComponent(props) {
      const [filterType, setFilterType] = React.useState(defaultType);
      return (
        <WrappedComponent
          {...props}
          filterType={filterType}
          onChangeFilterType={setFilterType}
        />
      );
    }

    return WithWrappedComponent;
  };

  return decorator;
};

export default withMultiTypeFilter;
