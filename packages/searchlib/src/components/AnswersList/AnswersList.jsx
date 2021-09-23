import React from 'react';
import { Segment } from 'semantic-ui-react';
import withAnswers from './withAnswers';

const AnswersList = (props) => {
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
  const showLoader = loading && !loaded;
  console.log('answeers', answers, showLoader, searchedTerm, searchedTerm);
  return (
    <div className="answers-list">
      {showLoader ? (
        <Segment loading={true}>
          <div className="loading-tip">Looking for semantic answers...</div>
        </Segment>
      ) : searchTerm && searchedTerm === searchTerm && answers?.length ? (
        <>
          {/* <h4>Semantic results for your query</h4> */}
          <hr />
          <ul>
            {answers.map((item) => (
              <li>
                {item.context.slice(0, item.offset_start)}
                <a href={item.document_id}>
                  <strong>
                    <em>
                      {item.context.slice(item.offset_start, item.offset_end)}
                    </em>
                  </strong>
                </a>
                {item.context.slice(item.offset_end, item.context.length)}
              </li>
            ))}
          </ul>
          <hr />
        </>
      ) : (
        ''
      )}
    </div>
  );
};

export default withAnswers(AnswersList);
