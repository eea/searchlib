import React from 'react';
import { useAppConfig, useSearchContext } from '@eeacms/search/lib/hocs';
import runRequest from '@eeacms/search/lib/runRequest';
import {
  buildQuestionRequest,
  buildSimilarityRequest,
  buildClassifyQuestionRequest,
} from './buildRequest';
import { requestFamily } from './state';
import { useAtom } from 'jotai';

const timeoutRef = {};

const withAnswers = (WrappedComponent) => {
  const Wrapped = (props) => {
    const searchContext = useSearchContext();

    const { searchTerm = '' } = searchContext;
    const { appConfig } = useAppConfig();
    const [searchedTerm, setSearchedTerm] = React.useState(searchTerm);
    const {
      qa_queryTypes = [
        'query:interrogative',
        'query:declarative',
        'query:keyword',
      ],
    } = appConfig?.nlp?.qa || {};

    const requestAtom = requestFamily(searchTerm);
    const [request, dispatch] = useAtom(requestAtom);
    // console.log('requestAtom', { request, searchedTerm, searchTerm });

    React.useEffect(() => {
      const timeoutRefCurrent = timeoutRef.current;
      if (timeoutRefCurrent) clearInterval(timeoutRef.current);

      const shouldRunSearch = searchTerm; // && searchTerm.trim().indexOf(' ') > -1;
      // console.log('shouldRunSearch', qa_queryTypes);

      if (shouldRunSearch) {
        timeoutRef.current = setTimeout(async () => {
          const { loading, loaded } = request;
          const classifyQuestionBody = await buildClassifyQuestionRequest(
            searchContext,
            appConfig,
          );
          const resp = await runRequest(classifyQuestionBody, appConfig);
          const { answer: query_type } = resp.body || {};
          console.log('classify resp', { classifyQuestionBody, resp });

          const requestBody = buildQuestionRequest(searchContext, appConfig);
          // console.log('query_type', query_type);

          // TODO: this might not be perfect, can be desynced
          if (!(loading || loaded) && qa_queryTypes.indexOf(query_type) > -1) {
            // console.log('run answers request', requestBody);
            dispatch({ type: 'loading' });
            const response = await runRequest(requestBody, appConfig);
            const { body } = response;
            const { answers = [] } = body;

            if (!answers.length) {
              dispatch({ type: 'loaded', data: answers });
              setSearchedTerm(searchTerm);
              return;
            }

            const [highestRatedAnswer, ...rest] = answers;
            const base = highestRatedAnswer.answer;
            const candidates = rest.map(({ answer }) => answer);

            // Take the highest rated response, determine which of the
            // answers are already paraphrasings, so that we can group them
            // together

            const [simResp] = await Promise.all([
              runRequest(
                buildSimilarityRequest({ base, candidates }, appConfig),
                appConfig,
              ),
            ]);

            const { predictions = [] } = simResp.body || {};
            const data = [
              highestRatedAnswer,
              ...rest
                .map((ans, i) => [ans, predictions[i]?.score])
                .filter(
                  ([, score]) => score > appConfig.nlp.similarity.cutoffScore,
                )
                .map(([ans, score]) => ans),
            ].reduce((acc, ans) => {
              // filter out duplicate results
              return acc.findIndex((a) => a.id === ans.id) > -1
                ? acc
                : [...acc, ans];
            }, []);
            dispatch({ type: 'loaded', data });
            setSearchedTerm(searchTerm);
          }
        }, 100);
      }
    }, [
      appConfig,
      searchContext,
      searchTerm,
      qa_queryTypes,
      dispatch,
      request,
    ]);

    return (
      <WrappedComponent
        {...props}
        answers={request.data}
        loading={request.loading}
        loaded={request.loaded}
        searchedTerm={searchedTerm}
        searchContext={searchContext}
      />
    );
  };
  return Wrapped;
};

export default withAnswers;
