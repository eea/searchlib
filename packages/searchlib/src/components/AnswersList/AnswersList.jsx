import React from 'react';
import { withSearch } from '@elastic/react-search-ui';
import { useAppConfig } from '@eeacms/search/lib/hocs/appConfig';
import { buildFullTextMatch } from '@eeacms/search/lib/search/query/fullText';
import { buildRequestFilter } from '@eeacms/search/lib/search/query/filters';
import runRequest from '@eeacms/search/lib/runRequest';

const buildQuestionRequest = (state, config) => {
  const {
    searchTerm,
    filters,
    // current,
    // resultsPerPage,
    // sortDirection,
    // sortField,
  } = state;

  const match = buildFullTextMatch(searchTerm, filters, config);
  const filter = buildRequestFilter(filters, config);

  const body = {
    query: {
      // Dynamic values based on current Search UI state
      function_score: {
        query: {
          bool: {
            must: [match],
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

      setTimeout(async () => {
        const requestBody = buildQuestionRequest(searchContext, appConfig);
        const response = await runRequest(requestBody, appConfig);
        const { body } = response;
        console.log({ requestBody, appConfig, searchContext, body });
        setAnswers(body.hits?.hits || []);
      }, 500);

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
  console.log('answers', props);
  const { answers = [] } = props;
  return (
    <div>
      <h4>Answers</h4>
      <ul>
        {answers.map((item) => (
          <li>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
};

export default withAnswers(AnswersList);
