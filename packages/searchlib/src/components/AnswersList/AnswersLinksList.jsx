import React from 'react';
import cx from 'classnames';
import { Label } from 'semantic-ui-react'; //, Icon, Accordion

import { ExternalLink } from '@eeacms/search/components/Result/HorizontalCardItem';
import { DateTime } from '@eeacms/search/components'; //, StringList
import { convertHitToResult } from '@eeacms/search/lib/search/state/results';
import { highlightUrl } from './utils';

const extractDomain = (url) => {
  return url ? new URL(url).hostname : url;
};

export default ({ filtered, appConfig }) => {
  const { horizontalCardViewParams } = appConfig;
  const { titleField, urlField } = horizontalCardViewParams;

  return filtered.slice(0, 5).map((item, i) => {
    const result = convertHitToResult(
      { ...item, _source: item.source },
      appConfig.field_filters,
    );
    const date = Date.parse(result['issued']?.raw);
    const days = result && (Date.now() - date) / 1000 / 60 / 60 / 24;
    let expired =
      result?.['expires']?.raw !== undefined
        ? Date.parse(result['expires']?.raw) < Date.now()
        : false;

    return (
      <div key={i} className={cx({ primary: i === 0 })}>
        <span className="answer__date">
          <DateTime format="DATE_MED" value={result['issued']?.raw} />
        </span>
        <ExternalLink href={highlightUrl(result[urlField]?.raw, item.answer)}>
          {result[titleField]?.raw}
        </ExternalLink>
        <span className="answer__domain">
          Source:{' '}
          <ExternalLink href={highlightUrl(result[urlField]?.raw, item.answer)}>
            {extractDomain(result[urlField]?.raw)}
          </ExternalLink>
        </span>
        {days < 30 && (
          <Label className="new-item" horizontal>
            New
          </Label>
        )}
        {expired && (
          <Label className="archived-item" horizontal>
            Archived
          </Label>
        )}
      </div>
    );
  });
};
