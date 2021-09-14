import React from 'react';
import { Modal, Item } from 'semantic-ui-react';
import String from './String';

export const ListingViewDetails = (props) => {
  const { result, appConfig } = props;
  const { listingViewParams } = appConfig;
  const { details } = listingViewParams;
  // console.log('result', { result, details });
  return (
    <div className="listing-view-details">
      {details.sections?.map((section, index) => {
        if (section.condition && !section.condition(result)) return null;
        return (
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
                  <String
                    val={result[field.field]?.raw ?? result[field.field]}
                  />
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export const Header = (props) => {
  const [showModal, setShowModal] = React.useState(false);
  const { result, appConfig, details } = props;
  const { Level = 'h4', urlField, titleField } = props;
  const url = result[urlField]?.raw;
  const title = result[titleField]?.raw || result.id?.raw;
  const modalHref = `${window.location.href}&showitem=${result.id?.raw}`;

  React.useEffect(() => {
    if (window.location.search.includes('showitem=' + result.id?.raw)) {
      // TODO: set url = modalHref
      setShowModal(true);
    }
  }, [result.id.raw]);

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
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        onOpen={() => setShowModal(true)}
        closeOnDimmerClick={true}
        closeOnDocumentClick={true}
      >
        <Modal.Header>
          {details?.titleField ? result[details.titleField]?.raw : 'Details:'}
        </Modal.Header>
        <Modal.Content scrolling>
          <ListingViewDetails result={result} appConfig={appConfig} />
        </Modal.Content>
        <Modal.Actions>
          <button
            style={{ marginRight: 14 + 'px' }}
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.href}&showitem=${result.id?.raw}`,
              );
            }}
          >
            Copy permalink
          </button>
          <button onClick={() => setShowModal(false)}>Close</button>
        </Modal.Actions>
      </Modal>
    </>
  );
};
