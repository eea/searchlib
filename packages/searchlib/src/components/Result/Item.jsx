import React from 'react';
import { Modal, Item } from 'semantic-ui-react';

const Header = (props) => {
  const [showModal, setShowModal] = React.useState(false);
  const { result } = props;
  const { Level = 'h4', urlField, titleField } = props;

  const link = urlField ? (
    <a href={result[urlField].raw}>{result[titleField].raw}</a>
  ) : (
    <Item.Header
      as="a"
      onClick={() => setShowModal(true)}
      onKeyDown={() => setShowModal(true)}
    >
      {result[titleField].raw}
    </Item.Header>
  );

  return (
    <>
      <Level>{link}</Level>
      <Modal open={showModal}>
        <Modal.Header>Details:</Modal.Header>
        <Modal.Content>{JSON.stringify(props.result)}</Modal.Content>
        <Modal.Actions>
          <button onClick={() => setShowModal(false)}>Close</button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

const ResultItem = (props) => {
  const { result, extraFields = [] } = props;

  return (
    <>
      <Item>
        <Item.Content>
          <Header {...props} />
          <Item.Extra>
            {extraFields.map(({ field, label }, i) => (
              <div className="simple-item-extra" key={i}>
                <strong>{label}:</strong> <em>{result[field].raw}</em>
              </div>
            ))}
          </Item.Extra>
        </Item.Content>
      </Item>
    </>
  );
};

export default ResultItem;
