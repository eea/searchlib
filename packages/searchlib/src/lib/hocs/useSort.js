import React from 'react';

const useSort = (values, criterias, { defaultSortOn, defaultSortOrder }) => {
  const [sortOn, setSortOn] = React.useState(defaultSortOn);
  const [sortOrder, setSortOrder] = React.useState(defaultSortOrder);

  const toggleSort = (name) => {
    if (sortOn === name) {
      // toggle sort direction;
      setSortOrder(sortOrder === 'ascending' ? 'descending' : 'ascending');
      return;
    } else {
      setSortOrder(defaultSortOrder);
      setSortOn(name);
    }
  };

  const sorter = (options) => {
    return Array.from(options).sort((a, b) => {
      return sortOrder === 'ascending'
        ? a[sortOn] > b[sortOn]
          ? a[sortOn] !== b[sortOn]
            ? 1
            : 0
          : -1
        : b[sortOn] > a[sortOn]
        ? b[sortOn] !== a[sortOn]
          ? 1
          : 0
        : -1;
    });
  };

  return {
    sortedValues: sorter(values),
    sorting: { sortOn, sortOrder },
    toggleSort,
  };
};

export default useSort;
