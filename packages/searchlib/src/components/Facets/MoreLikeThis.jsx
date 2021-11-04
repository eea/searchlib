import React from 'react';
import Filter from './../FilterList/Filter';
import { useSearchContext } from '@eeacms/search/lib/hocs';

const MoreLikeThis = (props) => {
  const { filters, clearFilters, setFilter, removeFilter } = useSearchContext();

  const filter = filters.find((el) => el.field === 'moreLikeThis');

  return (
    <div className="mlt-filter">
      <div className="header">More like this</div>

      <Filter
        {...filter}
        setFilter={setFilter}
        noTitle={true}
        removeFilter={removeFilter}
        onClear={(field) => {
          const activeFilters = filters.map(({ field }) => field);
          const exclude = activeFilters.filter((name) => name !== field);
          clearFilters(exclude);
        }}
      />
    </div>
  );
};

export default MoreLikeThis;
