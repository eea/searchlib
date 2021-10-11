import React from 'react';

/**
 * A hoc that grants multi-type faceting (all/any)
 *
 */

const withMultiTypeFilter = (options = {}) => {
  const { defaultType = 'any' } = options;

  const filterTypes = [
    { key: 2, text: 'Match any', value: 'any' },
    { key: 1, text: 'Match all', value: 'all' },
  ];

  const decorator = (WrappedComponent) => {
    function WithWrappedComponent(props) {
      const { field = null, filters = {} } = props;
      const defaultValue = field
        ? filters?.find((f) => f.field === field)?.type
        : defaultType;
      const [filterType, setFilterType] = React.useState(defaultValue);
      return (
        <WrappedComponent
          {...props}
          filterType={filterType}
          selectedFilterType={filterType}
          availableFilterTypes={filterTypes}
          onChangeFilterType={(v) => {
            setFilterType(v);
          }}
        />
      );
    }

    return WithWrappedComponent;
  };

  return decorator;
};

export default withMultiTypeFilter;
