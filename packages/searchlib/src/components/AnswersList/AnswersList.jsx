import React from 'react';
import { Segment, Label } from 'semantic-ui-react'; //, Rating, Icon, Accordion
import withAnswers from './withAnswers';
import HorizontalCardItem, {
  ExternalLink,
} from '@eeacms/search/components/Result/HorizontalCardItem';
import { convertHitToResult } from '@eeacms/search/lib/search/state/results';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import cx from 'classnames';

const AnswerContext = ({ item }) => {
  return (
    <>
      {item.context.slice(0, item.offset_start)}
      <strong>{item.context.slice(item.offset_start, item.offset_end)}</strong>
      {item.context.slice(item.offset_end, item.context.length)}
    </>
  );
};

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

  // console.log('filtered', { filtered, sliced: filtered?.slice(1) });
  console.log('answers', {
    appConfig,
    answers,
    showLoader,
    searchedTerm,
    searchTerm,
    filtered,
    cutoff,
  });
  // <Segment>
  //   <div className="loading-tip">Looking for semantic answers...</div>
  // </Segment>
  const primaryAnswer = filtered?.[0];

  return (
    <div className="answers-list">
      {showLoader ? (
        ''
      ) : searchTerm && searchedTerm === searchTerm && filtered?.length ? (
        <Segment className="answers-wrapper">
          <div className="answerCard">
            <h3 className="answers__directAnswer">{filtered[0].answer}</h3>
            <AnswerContext item={primaryAnswer} />;
            <div className="answers__links">
              {filtered.slice(0, 5).map((item, i) => {
                const result = convertHitToResult(
                  { ...item, _source: item.source },
                  appConfig.field_filters,
                );
                const days =
                  result &&
                  (Date.now() - Date.parse(result['issued']?.raw)) /
                    1000 /
                    60 /
                    60 /
                    24;
                let expired =
                  result?.['expires']?.raw !== undefined
                    ? Date.parse(result['expires']?.raw) < Date.now()
                    : false;

                return (
                  <div key={i} className={cx({ primary: i === 0 })}>
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
                  </div>
                );
              })}
            </div>
          </div>
          <h4 className="answers__boxtitle">Direct answer</h4>
        </Segment>
      ) : (
        ''
      )}
    </div>
  );
};

export default withAnswers(AnswersList);
