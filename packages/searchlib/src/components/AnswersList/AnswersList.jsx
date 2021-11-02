import React from 'react';

import { Segment, Rating, Popup, Button } from 'semantic-ui-react'; //, Icon, Accordion

import { ExternalLink } from '@eeacms/search/components/Result/HorizontalCardItem';
import { convertHitToResult } from '@eeacms/search/lib/search/state/results';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import AnswerBoxDetails from './AnswerBoxDetails';
import { highlightUrl } from './utils';
import AnswerLinksList from './AnswersLinksList';

import withAnswers from './withAnswers';

const AnswerContext = ({ item, href }) => {
  const { full_context, answer } = item;

  const start = (full_context || '').indexOf(answer);

  const pre = full_context
    ? full_context.slice(0, start)
    : item.context.slice(0, item.offset_start);
  const ans = full_context
    ? answer
    : item.context.slice(item.offset_start, item.offset_end);
  const post = full_context
    ? full_context.slice(start + answer.length, full_context.length)
    : item.context.slice(item.offset_end, item.context.length);

  return (
    <>
      {pre}
      <strong>
        <ExternalLink href={highlightUrl(href, ans)}>{ans}</ExternalLink>
      </strong>
      {post}
    </>
  );
};

const AnswersList = (props) => {
  const { appConfig } = useAppConfig();
  const { horizontalCardViewParams } = appConfig;
  const { urlField } = horizontalCardViewParams;
  const { answers = [], loading, loaded, searchedTerm } = props;
  const { searchContext } = props;
  const { searchTerm = '' } = searchContext;
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
  let cutoff = 0.1;
  try {
    cutoff = parseFloat(appConfig.nlp.qa.cutoffScore ?? 0.1);
  } catch {
    cutoff = 0.1;
  }
  const showLoader = loading && !loaded;
  const filtered = answers?.filter((item) => item.score >= cutoff);

  const primaryAnswer = filtered?.[0];
  const primaryResult = primaryAnswer
    ? convertHitToResult(
        { ...primaryAnswer, _source: primaryAnswer?.source },
        appConfig.field_filters,
      )
    : null;

  return (
    <div className="answers-list">
      {showLoader ? (
        <Segment className="answers__loading">
          <div className="loading-tip">Searching for direct answers...</div>
          <div className="progress">
            <div className="color"></div>
          </div>
        </Segment>
      ) : searchTerm && searchedTerm === searchTerm && filtered?.length ? (
        <>
          <Segment className="answers-wrapper">
            <div className="answerCard">
              {/* <h3 className="answers__directAnswer">{filtered[0].answer}</h3> */}
              <AnswerContext
                item={primaryAnswer}
                href={primaryResult[urlField]?.raw}
              />
              <div className="answers__links">
                <AnswerLinksList appConfig={appConfig} filtered={filtered} />
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
        </>
      ) : (
        ''
      )}
    </div>
  );
};

export default withAnswers(AnswersList);
// console.log('filtered', { filtered, sliced: filtered?.slice(1) });
// console.log('answers', {
//   appConfig,
//   answers,
//   showLoader,
//   searchedTerm,
//   searchTerm,
//   filtered,
//   cutoff,
// });
// <Segment>
//   <div className="loading-tip">Looking for semantic answers...</div>
// </Segment>
