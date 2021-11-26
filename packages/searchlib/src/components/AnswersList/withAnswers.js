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
    const { resultSearchTerm = '', query_type, filters } = searchContext;
    const searchTerm = resultSearchTerm;
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
      const timeoutRefCurrent = timeoutRef.current;
      if (timeoutRefCurrent) clearInterval(timeoutRef.current);

      const shouldRunSearch = searchTerm; // && searchTerm.trim().indexOf(' ') > -1;

      if (shouldRunSearch) {
        timeoutRef.current = setTimeout(async () => {
          const { loading, loaded } = request;
          const requestBody = buildQuestionRequest(searchContext, appConfig);

          // TODO: this might not be perfect, can be desynced
          if (!(loading || loaded) && qa_queryTypes.indexOf(query_type) > -1) {
            dispatch({ type: 'loading' });

            const response = await runRequest(requestBody, appConfig);
            const { body } = response;
            const { answers = [] } = body;

            if (!answers.length) {
              dispatch({
                type: 'loaded',
                data: { data: [], answers: [], predictions: [], clusters: [] },
              });
              setSearchedTerm(searchTerm);
              return;
            }

            const [highestRatedAnswer, ...rest] = answers;

            const simResp = await runRequest(
              // Take the highest rated response, determine which of the
              // answers are already paraphrasings, so that we can group them
              // together. Ideally this should be moved in the NLP pipeline

              buildSimilarityRequest(
                {
                  base: highestRatedAnswer.answer,
                  candidates: rest.map(({ answer }) => answer),
                },
                appConfig,
              ),
              appConfig,
            );

            const { predictions = [], clusters = [] } = simResp.body || {};
            const answersList = [
              highestRatedAnswer,
              ...rest
                .map((ans, i) => [ans, predictions[i]?.score])
                .filter(
                  ([, score]) => score > appConfig.nlp.similarity.cutoffScore,
                )
                .map(([ans, score]) => ans),
            ].reduce((acc, ans) => {
              // filter out duplicate results
              return acc.findIndex(
                (a) => a.source?.about === ans.source?.about,
              ) > -1
                ? acc
                : [...acc, ans];
            }, []);

            dispatch({
              type: 'loaded',
              data: { predictions, clusters, answers: answersList },
            });
            setSearchedTerm(searchTerm);
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
        data={request.data}
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
