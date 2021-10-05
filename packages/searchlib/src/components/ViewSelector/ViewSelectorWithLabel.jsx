import React from 'react';
import { Dropdown } from 'semantic-ui-react';

const ViewSelectorWithLabel = (props) => {
  const { views, active, onSetView } = props;

  const viewOptions = views.map((view) => ({
    key: view.id,
    text: view.title,
    value: view.id,
  }));

  return (
    <div className="view-selector">
      <span>
        Display as{' '}
        <Dropdown
          inline
          options={viewOptions}
          defaultValue={active}
          onChange={(e, { value }) => {
            onSetView(value);
          }}
        />
      </span>
    </div>
  );
};

export default ViewSelectorWithLabel;
