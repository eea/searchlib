import React from 'react';

import { Dropdown } from 'semantic-ui-react';

const SortingView = (props) => {
  const { label, options, onChange } = props;
  return (
    <div className="sorting">
      <Dropdown
        selection
        placeholder={label || 'Sort by'}
        floating
        options={options.map(({ label, value }) => ({ text: label, value }))}
        onChange={(e, { value }) => {
          onChange(value);
        }}
      />
    </div>
  );
};

export default SortingView;
