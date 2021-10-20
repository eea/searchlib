import React from 'react';
import { withSearch } from '@elastic/react-search-ui';
import { Icon, Image, Label, Dropdown } from 'semantic-ui-react';
import { DateTime, StringList } from '@eeacms/search/components';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { useAtom } from 'jotai';
import { moreLikeThisAtom } from '@eeacms/search/state';
import cx from 'classnames';

const normalizeStr = (str) => {
  let tmp = document.createElement('DIV');
  tmp.innerHTML = str;
  str = tmp.textContent || tmp.innerText || '';
  return str;
};

export const ExternalLink = (props) => {
  return (
    <a
      className={props.className}
      href={props.href}
      target="_blank"
      rel="noreferrer"
      style={props.style}
    >
      {props.children}
    </a>
  );
};

const CardItemComponent = withSearch(({ setFilter, removeFilter }) => ({
  setFilter,
  removeFilter,
}))((props) => {
  const { result, setFilter, removeFilter, showControls = true } = props;
  const { appConfig, registry } = useAppConfig();
  const days =
    (Date.now() - Date.parse(result['issued']?.raw)) / 1000 / 60 / 60 / 24;

  let expired =
    result['expires']?.raw !== undefined
      ? Date.parse(result['expires']?.raw) < Date.now()
      : false;

  const thumbFactoryName = appConfig.cardViewParams.getThumbnailUrl;

  const getThumb =
    registry.resolve[thumbFactoryName] ||
    ((result, config, fallback) => fallback);

  const thumbUrl = getThumb(
    result,
    appConfig,
    // TODO: use a configured default
    'https://react.semantic-ui.com/images/wireframe/white-image.png',
  );

  const clusterIcons = appConfig.cardViewParams.clusterIcons;
  const getClusterIcon = (result) => {
    return (
      clusterIcons[result.objectProvides.raw]?.icon ||
      clusterIcons.fallback.icon
    );
  };
  const clusterIcon = getClusterIcon(result);

  const url = props.urlField ? result[props.urlField]?.raw : result.id?.raw;
  const [, setMoreLikeThis] = useAtom(moreLikeThisAtom);
  const source = url
    .replace('https://', '')
    .replace('http://', '')
    .split('/')[0];

  const [hovered, setHovered] = React.useState(false);
  const description = normalizeStr(result[props.descriptionField]?.raw || '');

  return (
    <>
      <div
        className={cx('search-result', { hovered })}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="col-full">
          <div className="meta">
            <Icon name={clusterIcon} size="small" />
            <span className="date">
              <DateTime
                format="DATE_MED"
                value={result[props.issuedField]?.raw}
              />
            </span>
            <span className="tags">
              <StringList value={result[props.tagsField]?.raw} />
            </span>
            {showControls && (
              <Dropdown icon="ellipsis vertical">
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => {
                      removeFilter('lessLikeThis');
                      setMoreLikeThis(result);
                      setFilter('moreLikeThis', result._original._id, 'none');
                    }}
                  >
                    More like this
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </div>
        <div className="col-left">
          <div className="details">
            <h3>
              <ExternalLink href={url}>
                {result[props.titleField]?.raw}
              </ExternalLink>
              {days < 30 && (
                <>
                  &nbsp;
                  <Label className="new-item" horizontal>
                    New
                  </Label>
                </>
              )}
              {expired && (
                <>
                  &nbsp;
                  <Label className="archived-item" horizontal>
                    Archived
                  </Label>
                </>
              )}
            </h3>
            {props.children ? props.children : <p>{description}</p>}
            <p className="source">
              <span>Source: </span>
              <ExternalLink href={url}>{source}</ExternalLink>
            </p>
          </div>
        </div>
        <div className="col-right">
          <Image
            className="img-thumbnail"
            src={thumbUrl}
            wrapped
            ui={false}
            fluid
            centered
            as={ExternalLink}
            href={url}
            target="_blank"
            rel="noreferrer"
          />
        </div>
      </div>
    </>
  );
});

const CardItem = (props) => <CardItemComponent {...props} />;

export default CardItem;
// const iconFactoryName = appConfig.cardViewParams.getIconUrl;
// const getIcon = registry.resolve[iconFactoryName] || ((result, config, fallback) => fallback);
// const iconUrl = getIcon(
//   result,
//   appConfig,
//   // TODO: use a configured default
//   'https://react.semantic-ui.com/images/wireframe/white-image.png',
// );
