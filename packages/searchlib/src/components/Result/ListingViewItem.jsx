import React from 'react';
import { Modal, Item } from 'semantic-ui-react';
import { useAppConfig } from '@eeacms/search/lib/hocs/appConfig';

export const ListingViewDetails = (props) => {
  const { result, appConfig } = props;
  const { listingViewParams } = appConfig;
  const { details } = listingViewParams;
  return (
    <div className="listing-view-details">
      {/* {JSON.stringify(props.result)} */}
      {details.sections?.map((section, index) => (
        <div className="listing-view-details-section" key={index}>
          {section.title ? <h4>{section.title}</h4> : ''}
          {section.titleField ? <h5>{result[section.titleField]?.raw}</h5> : ''}
          {section.fields?.map((field, index) => (
            <div className="details-field" key={index}>
              <div className="details-field-label">
                {field.label || field.field}
              </div>
              <div className="details-field-value">
                {result[field.field]?.raw}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const Header = (props) => {
  const [showModal, setShowModal] = React.useState(false);
  const { result, appConfig } = props;
  const { listingViewParams } = appConfig;
  const { details } = listingViewParams;
  const { Level = 'h4', urlField, titleField } = props;
  const url = result[urlField]?.raw;

  return (
    <>
      <Level>
        {url ? (
          <a href={result[urlField].raw}>{result[titleField].raw}</a>
        ) : (
          <Item.Header
            className="listing-view-item"
            as="a"
            onClick={() => setShowModal(true)}
            onKeyDown={() => setShowModal(true)}
          >
            {result[titleField].raw}
          </Item.Header>
        )}
      </Level>
      <Modal open={showModal}>
        <Modal.Header>
          {details.titleField ? result[details.titleField]?.raw : 'Details:'}
        </Modal.Header>
        <Modal.Content>
          <ListingViewDetails result={result} appConfig={appConfig} />
        </Modal.Content>
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
  const { appConfig } = useAppConfig();
  const { listingViewParams } = appConfig;
  // console.log('appConfig', listingViewParams);

  return (
    <Item>
      <Item.Content>
        <Header {...props} {...listingViewParams} appConfig={appConfig} />
        <Item.Extra>
          {listingViewParams?.extraFields?.map(({ field, label }, i) => (
            <div className="simple-item-extra" key={i}>
              <em>{label}:</em> {result[field].raw}
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
