import React from 'react';
import { Dropdown, Icon } from 'semantic-ui-react';
import { useWindowDimensions } from '@eeacms/search/lib/hocs';

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

  const { width } = useWindowDimensions();
  const isSmallScreen = width < 1000;

  let label = 'Display as';
  if (isSmallScreen) {
    label = ' ';
  }

  return (
    <div className="view-selector">
      <span>
        <Dropdown
          text={label}
          icon={iconNames[active]}
          key={active}
          inline
          options={viewOptions}
          defaultValue={active}
          onChange={(e, { value }) => {
            onSetView(value);
          }}
        />
        <Icon name="dropdown" />
      </span>
    </div>
  );
};

export default ViewSelectorWithLabel;
