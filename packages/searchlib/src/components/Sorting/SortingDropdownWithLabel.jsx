import React from 'react';

import { Dropdown } from 'semantic-ui-react';
import { useSearchContext } from '@eeacms/search/lib/hocs';

const SortingViewComponent = (props) => {
  const { label, options, onChange } = props;
  const searchContext = useSearchContext();
  const { sortField, sortDirection } = searchContext;
  return (
    <div className="sorting">
      {label}
      <Dropdown
        selection
        value={`${sortField}|||${sortDirection}`}
        floating
        options={options.map(({ label, value }) => ({ text: label, value }))}
        onChange={(e, { value }) => {
          onChange(value);
        }}
      />
    </div>
  );
};

const SortingView = (props) => <SortingViewComponent {...props} />;

export default SortingView;