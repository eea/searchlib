import React from 'react';

import { Dropdown } from 'semantic-ui-react';
import { useSearchContext } from '@eeacms/search/lib/hocs';

const SortingViewComponent = (props) => {
  const { label, options, onChange } = props;
  const searchContext = useSearchContext();
  const { sortField, sortDirection } = searchContext;
  const sortOptions = options.map(({ label, value }) => {
    return { text: label, value };
  });

  const activeValue = `${sortField}|||${sortDirection}`;

  const activeLabel = sortOptions.filter(({ text, value }) => {
    return value === activeValue;
  })[0].text;

  return (
    <div className="sorting">
      <span>
        <Dropdown
          text={`Sort by ${activeLabel}`}
          inline
          value={activeValue}
          options={sortOptions}
          onChange={(e, { value }) => {
            onChange(value);
          }}
        />
      </span>
    </div>
  );
};

const SortingView = (props) => <SortingViewComponent {...props} />;

export default SortingView;
