import React from 'react';

import { Segment, Button, Message, Label } from 'semantic-ui-react'; //, Accordion

import { useAppConfig } from '@eeacms/search/lib/hocs';
import { hasNonDefaultFilters } from '@eeacms/search/lib/search/helpers';

import Answers from './Answers';
import withAnswers from './withAnswers';
import useTimedMessage from './useTimedMessage';

const AnswerBox = (props) => {
  const { appConfig } = useAppConfig();

  const { data = {}, loading, loaded, searchedTerm } = props;
  const { sortedClusters = [] } = data || {};
  const { searchContext } = props;
  const { resultSearchTerm = '', filters, resetFilters } = searchContext;

  const hasActiveFilters = hasNonDefaultFilters(filters, appConfig);
  // TODO: this is hardcoded for globalsearch
  const hasActiveCluster =
    filters.findIndex((f) => f.field === 'op_cluster') > -1;
  // console.log('filters', filters);

  const messageCounter = useTimedMessage({
    resultSearchTerm,
    searchedTerm,
    timeout: 5,
  });

  const showLoader = loading && !loaded;
  const hasAnswers =
    resultSearchTerm &&
    searchedTerm === resultSearchTerm &&
    sortedClusters.length;

  const dontShow =
    !(showLoader || (resultSearchTerm && searchedTerm === resultSearchTerm)) ||
    hasActiveCluster;

  if (dontShow) return null;

  return showLoader ? (
    <div className="answers-list">
      <Segment className="answers__loading">
        <div className="loading-tip">
          Searching answers for <strong>{resultSearchTerm}</strong>
        </div>
        <div className="progress">
          <div className="color"></div>
        </div>
      </Segment>
    </div>
  ) : hasAnswers ? (
    <div className="answers-list">
      <Answers
        hasActiveFilters={hasActiveFilters}
        data={data}
        searchedTerm={searchedTerm}
        resetFilters={resetFilters}
      />
    </div>
  ) : hasActiveFilters ? (
    <div className="answers-list">
      <Message warning>
        No answers found, but you have active filters. You may try to{' '}
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
    </div>
  ) : (
    messageCounter > 0 && (
      <div className="answers-list">
        <Message warning>
          No direct answers for your question.
          <Label circular color="teal">
            {messageCounter}
          </Label>
        </Message>
      </div>
    )
  );
};

export default withAnswers(AnswerBox);

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

// const Answers = React.useCallback(
//   (props) => {
//     return (
//     );
//   },
//   [
//     appConfig,
//     position,
//     searchedTerm,
//     sortedClusters,
//     resetFilters,
//     hasActiveFilters,
//   ],
// );
