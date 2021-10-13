import React from 'react';
import { Dropdown, Icon } from 'semantic-ui-react';

const ViewSelectorWithLabel = (props) => {
  const { views, active, onSetView } = props;

  const iconNames = {
    horizontalCard: 'list alternate',
    card: 'th',
    table: 'table',
  };

  const viewOptions = views.map((view) => ({
    key: view.id,
    text: (
      <>
        <Icon title={view.title} name={iconNames[view.id]} />
      </>
    ),
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
