import React from 'react';
import cx from 'classnames';
import { Label } from 'semantic-ui-react'; //, Accordion

import { ExternalLink } from '@eeacms/search/components/Result/HorizontalCardItem';
import { Icon, DateTime, SegmentedBreadcrumb } from '@eeacms/search/components'; //, StringList
import { buildResult } from '@eeacms/search/lib/search/state/results';
import { firstWords, getTermDisplayValue } from '@eeacms/search/lib/utils';
import { highlightUrl } from './utils';

export default ({ filtered, appConfig }) => {
  const { vocab = {} } = appConfig;
  return filtered.map((item, i) => {
    const result = buildResult({ ...item, _source: item.source }, appConfig);
    const clusters = result.clusterInfo;

    return (
      <div key={i} className={cx({ primary: i === 0 })}>
        {Object.keys(clusters).map((cluster, index) => (
          <Icon
            key={index}
            family="Content types"
            {...clusters[cluster].icon}
          />
        ))}
        <ExternalLink href={highlightUrl(result.href, item.answer)}>
          {result.title}
        </ExternalLink>{' '}
        <span className="answer__domain">
          <ExternalLink href={result.href}>
            <span title={result.source} className="source">
              {firstWords(
                getTermDisplayValue({
                  vocab,
                  field: 'cluster_name',
                  term: result.source,
                }),
                8,
              )}
            </span>
            <SegmentedBreadcrumb
              href={result.href}
              short={true}
              maxChars={40}
            />
          </ExternalLink>
          {/* <ExternalLink href={highlightUrl(result.href, item.answer)}> */}
          {/*   {result.website} */}
          {/* </ExternalLink>{' '} */}
          <span className="answer__date">
            (<DateTime format="DATE_MED" value={result.issued} />)
          </span>
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
