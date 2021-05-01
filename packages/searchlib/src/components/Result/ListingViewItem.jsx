import React from 'react';
import { Modal, Item } from 'semantic-ui-react';
import { useAppConfig } from '@eeacms/search/lib/hocs/appConfig';

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

// needed because of weird use of component from react-search-ui
const Inner = (props) => {
  const { result } = props;
  const { listingViewParams } = useAppConfig();
  // console.log('appConfig', listingViewParams);

  return (
    <Item>
      <Item.Content>
        <Header {...props} {...listingViewParams} />
        <Item.Extra>
          {listingViewParams?.extraFields?.map(({ field, label }, i) => (
            <div className="simple-item-extra" key={i}>
              <strong>{label}:</strong> <em>{result[field].raw}</em>
            </div>
          ))}
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};

const ResultItem = (props) => {
  return <Inner {...props} />;
};

export default ResultItem;
