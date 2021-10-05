import React from 'react';
import { Container, Icon } from 'semantic-ui-react';
import { Dropdown } from 'semantic-ui-react';

const ViewSelectorWithLabel = (props) => {
  const { views, active, onSetView } = props;

  const viewOptions = views.map((view) => ({
    key: view.id,
    text: view.title,
    value: view.id,
  }));

  return (
    <Container className="view-selector">
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
      {/*
      Display as
      <Button.Group size="tiny" compact>
        {views.map((view) => {
          const { render: Render, icon, title } = view;
          return Render ? (
            <Render {...props} />
          ) : (
            <Button
              key={view.id}
              active={view.id === active}
              onClick={() => onSetView(view.id)}
            >
              {icon ? <Icon color="black" title={title} name={icon} /> : title}
            </Button>
          );
        })}
      </Button.Group>*/}
    </Container>
  );
};

export default ViewSelectorWithLabel;
