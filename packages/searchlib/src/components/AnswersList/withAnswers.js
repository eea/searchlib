import React from 'react';
import {
  useAppConfig,
  useSearchContext,
  useIsMounted,
} from '@eeacms/search/lib/hocs';
import runRequest from '@eeacms/search/lib/runRequest';
import {
  buildQuestionRequest,
  buildSimilarityRequest,
  // buildClassifyQuestionRequest,
} from './buildRequest';
import { requestFamily } from './state';
import { useAtom } from 'jotai';
import useDeepCompareEffect from 'use-deep-compare-effect';

const timeoutRef = {};

const withAnswers = (WrappedComponent) => {
  const Wrapped = (props) => {
    const searchContext = useSearchContext();
    // console.log('search context', searchContext);

    const { searchTerm = '', query_type, filters } = searchContext;
    const { appConfig } = useAppConfig();
    const [searchedTerm, setSearchedTerm] = React.useState(searchTerm);
    const {
      qa_queryTypes = [
        'query:interrogative',
        'query:declarative',
        'query:keyword',
      ],
    } = appConfig?.nlp?.qa || {};

    const requestAtom = requestFamily({ searchTerm, filters });
    const [request, dispatch] = useAtom(requestAtom);
    const isMounted = useIsMounted();

    useDeepCompareEffect(() => {
      // if (!isMounted) return;
      const timeoutRefCurrent = timeoutRef.current;
      if (timeoutRefCurrent) clearInterval(timeoutRef.current);

      const shouldRunSearch = searchTerm; // && searchTerm.trim().indexOf(' ') > -1;

      if (shouldRunSearch) {
        timeoutRef.current = setTimeout(async () => {
          const { loading, loaded } = request;
          const requestBody = buildQuestionRequest(searchContext, appConfig);

          // TODO: this might not be perfect, can be desynced
          if (!(loading || loaded) && qa_queryTypes.indexOf(query_type) > -1) {
            // isMounted.current &&
            dispatch({ type: 'loading' });

            const response = await runRequest(requestBody, appConfig);
            const { body } = response;
            const { answers = [] } = body;

            if (!answers.length) {
              // if (isMounted.current) {
              dispatch({ type: 'loaded', data: answers });
              setSearchedTerm(searchTerm);
              // }
              return;
            }

            const [highestRatedAnswer, ...rest] = answers;
            const base = highestRatedAnswer.answer;
            const candidates = rest.map(({ answer }) => answer);

            // Take the highest rated response, determine which of the
            // answers are already paraphrasings, so that we can group them
            // together. Ideally this should be moved in the NLP pipeline

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
            // if (isMounted.current) {
            dispatch({ type: 'loaded', data });
            setSearchedTerm(searchTerm);
            // }
          }
        }, 100);
      }
    }, [
      isMounted,
      appConfig,
      searchContext,
      searchTerm,
      qa_queryTypes,
      query_type,
      dispatch,
      request,
      filters,
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

// const classifyQuestionBody = await buildClassifyQuestionRequest(
//   searchContext,
//   appConfig,
// );
// const resp = await runRequest(classifyQuestionBody, appConfig);
// const {answer:query_type} = resp.body || {};
// console.log('classify resp', { classifyQuestionBody, resp });
// console.log('requestAtom', { request, searchedTerm, searchTerm });
// console.log('reqBody', requestBody);
// // console.log('query_type', query_type);
// console.log('run answers request', requestBody);
