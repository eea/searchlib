import React from 'react';

import { ExternalLink } from '@eeacms/search/components/Result/HorizontalCardItem';

import { SegmentedBreadcrumb, Icon, DateTime } from '@eeacms/search/components'; //, StringList
import { firstWords, getTermDisplayValue } from '@eeacms/search/lib/utils';
import { useAppConfig } from '@eeacms/search/lib/hocs';

import { highlightUrl } from './utils';

const WHITESPACE_RE = /\n|\t/;

const AnswerContext = ({ item, answerItem }) => {
  const { appConfig } = useAppConfig();
  const { vocab = {} } = appConfig;

  const { full_context = '', context, answer } = answerItem;
  const clusters = item.clusterInfo;
  const start = (full_context || context || '').indexOf(answer);

  const pre = (full_context
    ? full_context.slice(0, start)
    : context.slice(0, answerItem.offset_start)
  ).replace(WHITESPACE_RE, ' ');
  const ans = (full_context
    ? answer
    : context.slice(answerItem.offset_start, answerItem.offset_end)
  ).replace(WHITESPACE_RE, ' ');
  const post = (full_context
    ? full_context.slice(start + answer.length, full_context.length)
    : context.slice(answerItem.offset_end, answerItem.context.length)
  ).replace(WHITESPACE_RE, ' ');

  return (
    <div className="answer__primary">
      <span dangerouslySetInnerHTML={{ __html: pre }}></span>
      <ExternalLink href={highlightUrl(item.href, ans)}>
        <span dangerouslySetInnerHTML={{ __html: ans }}></span>
      </ExternalLink>{' '}
      <span dangerouslySetInnerHTML={{ __html: post }}></span> (
      <DateTime format="DATE_MED" value={item.issued} />)
      <h4 className="answer__primarylink">
        <ExternalLink href={highlightUrl(item.href, ans)}>
          <div>
            {Object.keys(clusters).map((cluster, index) => (
              <Icon
                key={index}
                family="Content types"
                {...clusters[cluster].icon}
              />
            ))}

            {item.title}
          </div>

          <div class="ui breadcrumb">
            <span>Source:</span>
            <span title={item.source} className="source">
              {firstWords(
                getTermDisplayValue({
                  vocab,
                  field: 'cluster_name',
                  term: item.source,
                }),
                8,
              )}
            </span>
            <SegmentedBreadcrumb href={item.href} short={true} maxChars={40} />
          </div>
        </ExternalLink>
      </h4>
    </div>
  );
};

export default AnswerContext;
