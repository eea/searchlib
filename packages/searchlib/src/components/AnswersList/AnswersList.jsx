import React from 'react';
import { Segment, Rating, Icon, Accordion } from 'semantic-ui-react';
import withAnswers from './withAnswers';
import HorizontalCardItem from '@eeacms/search/components/Result/HorizontalCardItem';
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

const Answer = ({ item }) => {
  const { appConfig } = useAppConfig();
  const result = convertHitToResult(
    { ...item, _source: item.source },
    appConfig.field_filters,
  );
  const [active, setActive] = React.useState();
  // console.log('result', result);

  return (
    <>
      <Accordion.Title onClick={() => setActive(!active)} active={active}>
        <Icon name="dropdown" />
        <div className="answer__text">
          {item.answer}
          <Rating
            rating={Math.round(5 * item.score)}
            maxRating={5}
            size="mini"
            disabled
          />
        </div>
      </Accordion.Title>
      <Accordion.Content active={active}>
        <HorizontalCardItem
          {...appConfig.horizontalCardViewParams}
          result={result}
          showControls={false}
        >
          <AnswerContext item={item} />
        </HorizontalCardItem>
      </Accordion.Content>
    </>
  );
};

const AnswersList = (props) => {
  const { appConfig } = useAppConfig();
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
    cutoff = parseFloat(appConfig.nlp.qa.cuttoffScore ?? 0.1);
  } catch {
    cutoff = 0.1;
  }
  const showLoader = loading && !loaded;
  const filtered = answers?.filter((item) => item.score >= cutoff);

  // console.log('answers', answers, showLoader, searchedTerm, searchedTerm);
  // <Segment>
  //   <div className="loading-tip">Looking for semantic answers...</div>
  // </Segment>

  return (
    <div className="answers-list">
      {showLoader ? (
        ''
      ) : searchTerm && searchedTerm === searchTerm && filtered?.length ? (
        <Segment className="answers-wrapper">
          <h4 className="answers__boxtitle">Direct answers</h4>
          <Accordion>
            {filtered.map((item, i) => (
              <Answer item={item} key={i} />
            ))}
          </Accordion>
        </Segment>
      ) : (
        ''
      )}
    </div>
  );
};

export default withAnswers(AnswersList);
