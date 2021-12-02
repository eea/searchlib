import React from 'react';

import {
  Segment,
  Rating,
  Popup,
  Button,
  Icon,
  // Transition,
} from 'semantic-ui-react'; //, Accordion

import { SegmentedBreadcrumb } from '@eeacms/search/components';
import { ExternalLink } from '@eeacms/search/components/Result/HorizontalCardItem';
import { buildResult } from '@eeacms/search/lib/search/state/results';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { DateTime } from '@eeacms/search/components'; //, StringList

import AnswerBoxDetails from './AnswerBoxDetails';
import AnswerLinksList from './AnswersLinksList';

import { highlightUrl } from './utils';
import withAnswers from './withAnswers';

const MAX_COUNT = 3;

const AnswerContext = ({ item, answerItem }) => {
  const { full_context = '', context, answer } = answerItem;

  const start = (full_context || context || '').indexOf(answer);

  const pre = full_context
    ? full_context.slice(0, start)
    : context.slice(0, answerItem.offset_start);
  const ans = full_context
    ? answer
    : context.slice(answerItem.offset_start, answerItem.offset_end);
  const post = full_context
    ? full_context.slice(start + answer.length, full_context.length)
    : context.slice(answerItem.offset_end, answerItem.context.length);

  return (
    <div className="answer__primary">
      {pre}{' '}
      <ExternalLink href={highlightUrl(item.href, ans)}>{ans}</ExternalLink>{' '}
      {post} (<DateTime format="DATE_MED" value={item.issued} />)
      <h4 className="answer__primarylink">
        <ExternalLink href={highlightUrl(item.href, ans)}>
          <SegmentedBreadcrumb href={item.href} />
          <Icon name={item.clusterIcon} />
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
  const { resultSearchTerm = '' } = searchContext;
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
  // const filtered = sortedClusters[position];

  console.log('pos', position);
  return (
    <div className="answers-list">
      {showLoader ? (
        <Segment className="answers__loading">
          <div className="loading-tip">Searching for direct answers...</div>
          <div className="progress">
            <div className="color"></div>
          </div>
        </Segment>
      ) : resultSearchTerm &&
        searchedTerm === resultSearchTerm &&
        sortedClusters.length ? (
        <div>
          {sortedClusters.length > 1 && (
            <Button.Group
              size="mini"
              attached="right"
              floated="right"
              color="blue"
            >
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
                  </Segment>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default withAnswers(AnswerBox);

//
// {sortedClusters.length > 1 && (
//   <div className="answers-bullets">
//     {Array(sortedClusters.length)
//       .fill(null)
//       .map((item, k) => (
//         <div
//           aria-label={`Set answerbox page to: ${k + 1}`}
//           onKeyDown={() => {}}
//           tabIndex="-1"
//           role="button"
//           key={k}
//           className={`bullet ${position === k ? 'active' : ''}`}
//           onClick={() => setPosition(k)}
//         ></div>
//       ))}
//   </div>
// )}
