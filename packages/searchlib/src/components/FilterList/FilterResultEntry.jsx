import React from 'react';
import { Icon } from 'semantic-ui-react';
import { useAtom } from 'jotai';
import { moreLikeThisAtom } from '@eeacms/search/state';
import { DateTime, StringList } from '@eeacms/search/components';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { ExternalLink } from './../Result/HorizontalCardItem';
import { Button, Image, Label } from 'semantic-ui-react';

const FilterResultEntry = (props) => {
  const { value } = props;
  const { appConfig, registry } = useAppConfig();
  const [result] = useAtom(moreLikeThisAtom);

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
      <div class="mlt-card">
        <Image
          className="img-thumbnail"
          src={thumbUrl}
          wrapped
          ui={false}
          fluid
          centered
          style={{ backgroundImage: `url('${thumbUrl}')` }}
          as={ExternalLink}
          href={result.about.raw}
          target="_blank"
          rel="noreferrer"
        />
        <a href={result.about.raw} target="_blank" rel="noreferrer">
          <Icon name="external" size="small" />
          {result.title.raw}
        </a>
        <p>
          <DateTime format="DATE_MED" value={result.issued.raw} />
          &nbsp;|&nbsp;
          <StringList value={result.subject.raw} />
        </p>
        <p>{result.description.raw}</p>
      </div>
    );
  }
  return value;
};

export default FilterResultEntry;
