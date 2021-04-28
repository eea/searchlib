import React from 'react';
import { Modal } from 'semantic-ui-react';

const Header = (props) => {
  const { Level = 'h4', urlField, titleField, result } = props;
  const [showModal, setShowModal] = React.useState(false);
  const link = urlField ? (
    <a href={result[urlField].raw}>{result[titleField].raw}</a>
  ) : (
    <button
      tabIndex="-1"
      onClick={() => setShowModal(true)}
      onKeyDown={() => setShowModal(true)}
    >
      {result[titleField].raw}
    </button>
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

const SimpleResult = (props) => {
  const { result, extraFields = [] } = props;
  // console.log('resprops', props);
  // titleField,
  // urlField,
  // summaryField,

  return (
    <div className="simple-item">
      <Header {...props} />
      {extraFields.map(({ field, label }, i) => (
        <div className="simple-item-extra" key={i}>
          <strong>{label}:</strong> <em>{result[field].raw}</em>
        </div>
      ))}
    </div>
  );
};

export default SimpleResult;
