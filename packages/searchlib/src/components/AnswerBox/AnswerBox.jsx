import React from 'react';

import {
  Segment,
  Rating,
  Popup,
  Button,
  Message,
  // Transition,
} from 'semantic-ui-react'; //, Accordion

import { SegmentedBreadcrumb } from '@eeacms/search/components';
import { ExternalLink } from '@eeacms/search/components/Result/HorizontalCardItem';
import { buildResult } from '@eeacms/search/lib/search/state/results';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { hasNonDefaultFilters } from '@eeacms/search/lib/search/helpers';
import { Icon, DateTime } from '@eeacms/search/components'; //, StringList
import { firstWords, getTermDisplayValue } from '@eeacms/search/lib/utils';

import AnswerBoxDetails from './AnswerBoxDetails';
import AnswerLinksList from './AnswersLinksList';

import { highlightUrl } from './utils';
import withAnswers from './withAnswers';

const MAX_COUNT = 3;
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
          <div class="ui breadcrumb">
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

          {Object.keys(clusters).map((cluster, index) => (
            <Icon
              key={index}
              family="Content types"
              {...clusters[cluster].icon}
            />
          ))}

          {item.title}
        </ExternalLink>
      </h4>
    </div>
  );
};

const AnswerBox = (props) => {
  const { appConfig } = useAppConfig();
  const [position, setPosition] = React.useState(0);

  const { data = {}, loading, loaded, searchedTerm } = props;
  const { sortedClusters = [] } = data || {};
  const { searchContext } = props;
  const { resultSearchTerm = '', filters, resetFilters } = searchContext;

  const hasActiveFilters = hasNonDefaultFilters(filters, appConfig);
  // console.log('filters', filters);

  /*
answer: "organoleptic factors, physico-chemical factors, toxic substances, microbiological parameters"
context: "nto account when assessing water quality (organoleptic factors, physico-chemical factors, toxic substances, microbiological parameters.↵(Source: RRDA)"
document_id: "http://www.eea.europa.eu/help/glossary/gemet-environmental-thesaurus/total-parameter"
id: "http://www.eea.europa.eu/help/glossary/gemet-environmental-thesaurus/total-parameter"
offset_end: 134
offset_end_in_doc: 176
offset_start: 42
offset_start_in_doc: 84
probability: 0.752453625202179
question: null
score: 6.118757247924805
*/
  //

  const showLoader = loading && !loaded;

  const Answers = React.useCallback(
    (props) => {
      return (
        <div>
          {sortedClusters.length > 1 && (
            <Button.Group size="mini" floated="right" color="blue">
              <Button
                icon="angle left"
                disabled={position === 0}
                onClick={() => setPosition(position - 1)}
              />
              <Button
                icon="angle right"
                disabled={position === sortedClusters.length - 1}
                onClick={() => setPosition(position + 1)}
              />
            </Button.Group>
          )}
          <div>
            <h2>{searchedTerm}</h2>
            {sortedClusters.map((filtered, i) => {
              const primaryAnswer = filtered?.[0];
              const primaryResult = primaryAnswer
                ? buildResult(
                    { ...primaryAnswer, _source: primaryAnswer?.source },
                    appConfig,
                  )
                : null;

              return (
                <div
                  key={i}
                  style={{ display: position === i ? 'block' : 'none' }}
                >
                  <Segment className="answers-wrapper">
                    <div className="answerCard">
                      {/* <h3 className="answers__directAnswer">{filtered[0].answer}</h3> */}
                      <AnswerContext
                        item={primaryResult}
                        answerItem={primaryAnswer}
                      />
                      <div className="answers__links">
                        <AnswerLinksList
                          appConfig={appConfig}
                          filtered={filtered
                            .slice(1, filtered.length)
                            .slice(1, Math.min(filtered.length, MAX_COUNT))}
                        />
                      </div>
                    </div>
                    <div className="answers__bottom">
                      <Rating
                        rating={Math.round(5 * primaryAnswer.score)}
                        maxRating={5}
                        size="mini"
                        disabled
                      />
                      <div className="answers__bottom__spacer"></div>
                      <Popup
                        trigger={
                          <Button basic size="mini">
                            Direct answer
                          </Button>
                        }
                      >
                        <AnswerBoxDetails />
                      </Popup>
                    </div>
                    {hasActiveFilters ? (
                      <Message warning>
                        This answer is extracted from documents matching the
                        active filters. You can{' '}
                        <Button
                          size="mini"
                          compact
                          primary
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            resetFilters();
                          }}
                        >
                          reset
                        </Button>{' '}
                        the filters to improve the quality of results.
                      </Message>
                    ) : (
                      ''
                    )}
                  </Segment>
                </div>
              );
            })}
          </div>
        </div>
      );
    },
    [
      appConfig,
      position,
      searchedTerm,
      sortedClusters,
      resetFilters,
      hasActiveFilters,
    ],
  );

  if (
    !(showLoader || (resultSearchTerm && searchedTerm === resultSearchTerm))
  ) {
    return null;
  } // && sortedClusters.length

  const showAnswers =
    resultSearchTerm &&
    searchedTerm === resultSearchTerm &&
    sortedClusters.length;

  return (
    <div className="answers-list">
      {showLoader ? (
        <Segment className="answers__loading">
          <div className="loading-tip">
            Searching for answers for <strong>{resultSearchTerm}</strong>
          </div>
          <div className="progress">
            <div className="color"></div>
          </div>
        </Segment>
      ) : showAnswers ? (
        <Answers />
      ) : hasActiveFilters ? (
        <Message warning>
          Now answers found, but you have active filters. You may try to{' '}
          <Button
            size="mini"
            compact
            primary
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              resetFilters();
            }}
          >
            reset
          </Button>{' '}
          the filters to improve the quality of results.
        </Message>
      ) : (
        <Message warning>Now direct answers for your question.</Message>
      )}
    </div>
  );
};

export default withAnswers(AnswerBox);
