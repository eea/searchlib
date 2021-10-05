import React from 'react';
import { Button, Container, Icon } from 'semantic-ui-react';
import { Dropdown } from 'semantic-ui-react';

// TODO: refactor as dropdown
const ViewSelectorWithLabel = (props) => {
  const { views, active, onSetView } = props;

  const friendOptions = [
    {
      key: 'Jenny Hess',
      text: 'Jenny Hess',
      value: 'Jenny Hess',
      image: { avatar: true, src: '/images/avatar/small/jenny.jpg' },
    },
    {
      key: 'Elliot Fu',
      text: 'Elliot Fu',
      value: 'Elliot Fu',
      image: { avatar: true, src: '/images/avatar/small/elliot.jpg' },
    },
    {
      key: 'Stevie Feliciano',
      text: 'Stevie Feliciano',
      value: 'Stevie Feliciano',
      image: { avatar: true, src: '/images/avatar/small/stevie.jpg' },
    },
    {
      key: 'Christian',
      text: 'Christian',
      value: 'Christian',
      image: { avatar: true, src: '/images/avatar/small/christian.jpg' },
    },
  ];

  console.log(views);
  const tempOptions = views.map((view) => ({
    key: view.id,
    text: view.title,
    value: view.title,
  }));
  console.log(tempOptions);

  return (
    <Container className="view-selector">
      <span>
        Display as{' '}
        <Dropdown
          inline
          options={tempOptions}
          defaultValue={tempOptions[0].value}
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
