import React from 'react';
import { Modal, Item } from 'semantic-ui-react';
import { useAppConfig } from '@eeacms/search/lib/hocs/appConfig';

const String = ({ val }) => {
  console.log('String', val);
  return typeof val === 'string'
    ? val
    : Array.isArray(val)
    ? val.map((item, i) => (
        <span key={i} className="array-string-item">
          <String val={item} key={i} />
        </span>
      ))
    : JSON.stringify(val);
};

export const ListingViewDetails = (props) => {
  const { result, appConfig } = props;
  const { listingViewParams } = appConfig;
  const { details } = listingViewParams;
  return (
    <div className="listing-view-details">
      {details.sections?.map((section, index) => (
        <div className="listing-view-details-section" key={index}>
          {section.title ? (
            <h4>
              <String val={section.title} />
            </h4>
          ) : (
            ''
          )}
          {section.titleField ? (
            <h5>
              <String val={result[section.titleField]?.raw} />
            </h5>
          ) : (
            ''
          )}
          {section.fields?.map((field, index) => (
            <div className="details-field" key={index}>
              <div className="details-field-label">
                <String val={field.label || field.field} />
              </div>
              <div className="details-field-value">
                <String val={result[field.field]?.raw} />
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
  const title = result[titleField]?.raw || result.id?.raw;

  return (
    <>
      <Level>
        {url ? (
          <a href={url}>{title}</a>
        ) : (
          <Item.Header
            className="listing-view-item"
            as="a"
            onClick={(e) => {
              setShowModal(true);
              e.preventDefault();
              e.stopPropagation();
            }}
            onKeyDown={() => setShowModal(true)}
          >
            {title}
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
              <em>{label}:</em> <String val={result[field]?.raw} />
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
