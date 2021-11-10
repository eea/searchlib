import React from 'react';
import cx from 'classnames';
import { Label, Icon } from 'semantic-ui-react'; //, Accordion

import { ExternalLink } from '@eeacms/search/components/Result/HorizontalCardItem';
import { DateTime } from '@eeacms/search/components'; //, StringList
import { buildResult } from '@eeacms/search/lib/search/state/results';
import { highlightUrl } from './utils';

export default ({ filtered, appConfig }) => {
  return filtered.slice(0, 5).map((item, i) => {
    const result = buildResult({ ...item, _source: item.source }, appConfig);

    return (
      <div key={i} className={cx({ primary: i === 0 })}>
        <span className="answer__date">
          <DateTime format="DATE_MED" value={result.issued} />
        </span>
        <Icon name={result.clusterIcon} />
        <ExternalLink href={highlightUrl(result.href, item.answer)}>
          {result.title}
        </ExternalLink>
        <span className="answer__domain">
          Source:{' '}
          <ExternalLink href={highlightUrl(result.href, item.answer)}>
            {result.website}
          </ExternalLink>
        </span>
        {result.isNew && (
          <Label className="new-item" horizontal>
            New
          </Label>
        )}
        {result.isExpired && (
          <Label className="archived-item" horizontal>
            Archived
          </Label>
        )}
      </div>
    );
  });
};
