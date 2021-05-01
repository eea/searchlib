import React from 'react';
import { Button } from 'semantic-ui-react';

const ViewSelector = (props) => {
  const { views, active, onSetView } = props;
  return (
    <div className="viewSelector">
      <Button.Group compact>
        {views.map((view) => {
          const { render: Render, icon: Icon, title } = view;
          return Render ? (
            <Render {...props} />
          ) : (
            <Button
              key={view.id}
              active={view.id === active}
              onClick={() => onSetView(view.id)}
            >
              {Icon ? <Icon {...props} /> : title}
            </Button>
          );
        })}
      </Button.Group>
    </div>
  );
};

export default ViewSelector;
