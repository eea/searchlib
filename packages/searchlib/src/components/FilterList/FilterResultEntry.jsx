/**
 * This is the display card for the "More like this" selection
 *
 */
import React from 'react';
import { Icon } from 'semantic-ui-react';
import { useAtom } from 'jotai';
import { moreLikeThisAtom } from '@eeacms/search/state';
import { DateTime, StringList } from '@eeacms/search/components';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { ExternalLink } from './../Result/HorizontalCardItem';
import { Image } from 'semantic-ui-react';

const FilterResultEntry = (props) => {
  const { value } = props;
  const { appConfig, registry } = useAppConfig();
  const [result] = useAtom(moreLikeThisAtom);

  const clusterIcons = appConfig.contentUtilsParams.clusterIcons;
  const getClusterIcon = (title) => {
    return clusterIcons[title]?.icon || clusterIcons.fallback.icon;
  };

  if (result) {
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

    return (
      <div className="mlt-filter ui fluid card facet active">
        <div className="mlt-card content">
          <div className="header">More like this</div>
          <Image
            className="img-thumbnail"
            src={thumbUrl}
            wrapped
            ui={false}
            fluid
            centered
            as={ExternalLink}
            href={result.about?.raw}
            target="_blank"
            rel="noreferrer"
          />
          <div className="meta">
            <Icon name={getClusterIcon(result.objectProvides?.raw)} />
            <DateTime format="DATE_MED" value={result.issued?.raw} />
            &nbsp;|&nbsp;
            <StringList value={result.subject?.raw} />
          </div>
          <h4>
            <a href={result.about.raw} target="_blank" rel="noreferrer">
              <Icon name="external" size="small" />
              {result.title?.raw}
            </a>
          </h4>
        </div>
      </div>
    );
  }
  return value;
};

export default FilterResultEntry;
