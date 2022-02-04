import React from 'react';

import ExternalLink from '@eeacms/search/components/Result/ExternalLink';
import { Icon, ResultSource } from '@eeacms/search/components'; //, StringList

import { highlightUrl } from './utils';

const WHITESPACE_RE = /\n|\t/;

const AnswerContext = ({ item, answerItem }) => {
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
      <span dangerouslySetInnerHTML={{ __html: post }}></span>
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
        </ExternalLink>
        <ResultSource item={item} />
      </h4>
    </div>
  );
};

export default AnswerContext;
