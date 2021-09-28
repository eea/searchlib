import React from 'react';
import { withSearch } from '@elastic/react-search-ui';
import { Grid, Button, Card, Image, Label } from 'semantic-ui-react';
import { DateTime, StringList } from '@eeacms/search';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import cx from 'classnames';

const normalizeStr = (str) => {
  let tmp = document.createElement('DIV');
  tmp.innerHTML = str;
  str = tmp.textContent || tmp.innerText || '';
  return str;
};

const ExternalLink = (props) => {
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
  // console.log('props', props);
  const { result, setFilter, removeFilter } = props;
  const { appConfig, registry } = useAppConfig();
  const days =
    (Date.now() - Date.parse(result['issued']?.raw)) / 1000 / 60 / 60 / 24;
  // console.log('card props', props, appConfig);

  const thumbFactoryName = appConfig.cardViewParams.getThumbnailUrl;

  const getThumb =
    registry.resolve[thumbFactoryName] ||
    ((result, config, fallback) => fallback);

  const iconFactoryName = appConfig.cardViewParams.getIconUrl;
  const getIcon =
    registry.resolve[iconFactoryName] ||
    ((result, config, fallback) => fallback);

  const thumbUrl = getThumb(
    result,
    appConfig,
    // TODO: use a configured default
    'https://react.semantic-ui.com/images/wireframe/white-image.png',
  );

  const iconUrl = getIcon(
    result,
    appConfig,
    // TODO: use a configured default
    'https://react.semantic-ui.com/images/wireframe/white-image.png',
  );
  const url = result.id?.raw;

  const [hovered, setHovered] = React.useState(false);
  const description = normalizeStr(result[props.descriptionField]?.raw || '');
  return (
    <>
      <div
        className={cx('search-result', { hovered })}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="col-left">
          <Image
            className="img-thumbnail"
            src={thumbUrl}
            wrapped
            ui={false}
            fluid
            centered
            style={{ backgroundImage: `url('${thumbUrl}')` }}
            as={ExternalLink}
            href={url}
            target="_blank"
            rel="noreferrer"
          />
        </div>
        <div className="col-right">
          <div className="details">
            <h4>
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
            </h4>
            <p>
              <DateTime
                format="DATE_MED"
                value={result[props.issuedField]?.raw}
              />
              &nbsp;|&nbsp;
              <StringList value={result[props.tagsField]?.raw} />
            </p>
            <p>{description}</p>
          </div>
          <div className="controls">
            <div>
              <Button
                compact
                floated="left"
                size="mini"
                onClick={() => {
                  removeFilter('lessLikeThis');
                  setFilter('moreLikeThis', result._original._id, 'none');
                }}
              >
                more like this
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

const CardItem = (props) => <CardItemComponent {...props} />;

export default CardItem;
