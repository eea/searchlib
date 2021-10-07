import React from 'react';
import { Segment, Label } from 'semantic-ui-react'; //, Rating, Icon, Accordion
import withAnswers from './withAnswers';
import HorizontalCardItem, {
  ExternalLink,
} from '@eeacms/search/components/Result/HorizontalCardItem';
import { convertHitToResult } from '@eeacms/search/lib/search/state/results';
import { useAppConfig } from '@eeacms/search/lib/hocs';

const AnswerContext = ({ item }) => {
  return (
    <>
      {item.context.slice(0, item.offset_start)}
      <strong>{item.context.slice(item.offset_start, item.offset_end)}</strong>
      {item.context.slice(item.offset_end, item.context.length)}
    </>
  );
};

// const Answer = ({ item }) => {
//   const { appConfig } = useAppConfig();
//   // const [active, setActive] = React.useState();
//   // console.log('result', result);
//
//   return (
//     <>
//       <Icon name="dropdown" />
//       <div className="answer__text">
//         {item.answer}
//         <Rating
//           rating={Math.round(5 * item.score)}
//           maxRating={5}
//           size="mini"
//           disabled
//         />
//       </div>
//       <HorizontalCardItem
//         {...appConfig.horizontalCardViewParams}
//         result={result}
//         showControls={false}
//       >
//         <AnswerContext item={item} />
//       </HorizontalCardItem>
//     </>
//   );
// };

const AnswersList = (props) => {
  const { appConfig } = useAppConfig();
  const { horizontalCardViewParams } = appConfig;
  const { titleField, urlField } = horizontalCardViewParams;
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
  console.log('filtered', { filtered, sliced: filtered?.slice(1) });

  // console.log('answers', answers, showLoader, searchedTerm, searchedTerm);
  // <Segment>
  //   <div className="loading-tip">Looking for semantic answers...</div>
  // </Segment>
  const primaryAnswer = filtered?.[0];
  const result = primaryAnswer
    ? convertHitToResult(
        { ...primaryAnswer, _source: primaryAnswer.source },
        appConfig.field_filters,
      )
    : null;
  const days =
    result &&
    (Date.now() - Date.parse(result['issued']?.raw)) / 1000 / 60 / 60 / 24;
  let expired =
    result?.['expires']?.raw !== undefined
      ? Date.parse(result['expires']?.raw) < Date.now()
      : false;

  return (
    <div className="answers-list">
      {showLoader ? (
        ''
      ) : searchTerm && searchedTerm === searchTerm && filtered?.length ? (
        <Segment className="answers-wrapper">
          <h4 className="answers__boxtitle">Direct answers</h4>
          <div className="answerCard">
            <h3 className="answers_directAnswer">{filtered[0].answer}</h3>
            <h3 key={filtered[0].answer}>
              <ExternalLink href={result[urlField]?.raw}>
                {result[titleField]?.raw}
              </ExternalLink>
              {days < 30 && (
                <>
                  &nbsp;
                  <Label className="new-item" horizontal>
                    New
                  </Label>
                </>
              )}
              {expired && (
                <>
                  &nbsp;
                  <Label className="archived-item" horizontal>
                    Archived
                  </Label>
                </>
              )}
            </h3>
            <AnswerContext item={primaryAnswer} />;
            {filtered.slice(1).map((item, i) => {
              const result = convertHitToResult(
                { ...item, _source: item.source },
                appConfig.field_filters,
              );
              return (
                <div key={i}>
                  <ExternalLink href={result[urlField]?.raw}>
                    {result[titleField]?.raw}
                  </ExternalLink>
                </div>
              );
            })}
          </div>
        </Segment>
      ) : (
        ''
      )}
    </div>
  );
};

export default withAnswers(AnswersList);
