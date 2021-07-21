import React from 'react';
import { withSearch } from '@elastic/react-search-ui';
import { useAppConfig } from '@eeacms/search/lib/hocs/appConfig';
import { buildRequestFilter } from '@eeacms/search/lib/search/query/filters';
import runRequest from '@eeacms/search/lib/runRequest';
// import { buildFullTextMatch } from '@eeacms/search/lib/search/query/fullText';

const buildQuestionRequest = (state, config) => {
  const {
    searchTerm,
    filters,
    // current,
    // resultsPerPage,
    // sortDirection,
    // sortField,
  } = state;

  let question = searchTerm;
  if (question.indexOf('|') > -1) {
    question = question.split('|').filter((p) => !!p.trim());
  }
  if (Array.isArray(question)) {
    question = question.join(' ');
  }

  const filter = buildRequestFilter(filters, config);

  const body = {
    question,
    query: {
      // Dynamic values based on current Search UI state
      function_score: {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  // eslint-disable-next-line
                  query: '${query}',
                  fields: [
                    // TODO: use in the above query
                    ...(config.extraQueryParams?.text_fields || [
                      'all_fields_for_freetext',
                    ]),
                  ],
                },
              },
            ],
            ...(filter && { filter }),
          },
        },
        // functions: [...(config.extraQueryParams?.functions || [])],
        // score_mode: config.extraQueryParams?.score_mode || 'sum',
      },
    },
    // ...(sort && { sort }),
    // ...(size && { size }),
    // ...(from && { from }),
    track_total_hits: true,
    isQuestion: true,
  };

  // console.log('a body', body);

  return body;
};

const _withAnswers = (WrappedComponent) => {
  const WithSearchComponent = (props) => {
    const { searchContext } = props;
    const { appConfig } = useAppConfig();

    const timeoutRef = React.useRef();
    const [answers, setAnswers] = React.useState([]);

    React.useEffect(() => {
      const timeoutRefCurrent = timeoutRef.current;
      if (timeoutRefCurrent) clearInterval(timeoutRef.current);

      const { searchTerm = '' } = searchContext;
      if (searchTerm && searchTerm.trim().indexOf(' ') > -1) {
        timeoutRef.current = setTimeout(() => {
          const requestBody = buildQuestionRequest(searchContext, appConfig);
          runRequest(requestBody, appConfig).then((response) => {
            const { body } = response;
            // console.log('response', response);
            setAnswers(body.answers || []);
          });
        }, 1000);
      }

      return () => timeoutRefCurrent && clearInterval(timeoutRefCurrent);
    }, [appConfig, searchContext]);

    return <WrappedComponent answers={answers} {...props} />;
  };
  return WithSearchComponent;
};

const withAnswers = (WrappedComponent) =>
  withSearch((context) => ({ searchContext: context }))(
    _withAnswers(WrappedComponent),
  );

const AnswersList = (props) => {
  const { answers = [] } = props;
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
  return (
    <div>
      <h4>Answers</h4>
      <ul>
        {answers.map((item) => (
          <li>
            {item.context.slice(0, item.offset_start)}
            <strong>
              <em>{item.context.slice(item.offset_start, item.offset_end)}</em>
            </strong>
            {item.context.slice(item.offset_end, item.context.length)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default withAnswers(AnswersList);
