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
    const { appConfig } = useAppConfig();
    const isMounted = useIsMounted();

    const { resultSearchTerm = '', query_type, filters } = searchContext;
    const searchTerm = resultSearchTerm;
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

    let cutoff = 0.1;
    try {
      cutoff = parseFloat(appConfig.nlp.qa.cutoffScore ?? 0.1);
    } catch {
      cutoff = 0.1;
    }

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

            const validAnswers = answers?.filter(
              (item) => item.score >= cutoff,
            );

            if (!validAnswers.length) {
              dispatch({
                type: 'loaded',
                data: { data: [], answers: [], clusters: [] },
              });
              setSearchedTerm(searchTerm);
              return;
            }

            const [highestRatedAnswer, ...rest] = answers;

            const simResp = await runRequest(
              // Take the highest rated response, determine which of the
              // answers are already paraphrasings, so that we can group them
              // together. Ideally this should be moved in the NLP pipeline
              //
              // TODO: we sent the similarity request, but actually only use
              // clusterization

              buildSimilarityRequest(
                {
                  base: highestRatedAnswer.answer,
                  candidates: rest.map(({ answer }) => answer),
                },
                appConfig,
              ),
              appConfig,
            );

            const { clusters = [] } = simResp.body || {};

            // form clusters of responses, ordered by the highest scoring
            // member of the cluster. Inside each cluster we de-duplicate
            // (don't list the same link twice)

            const clusterMap = {};
            clusters.forEach(([sent, clusterId]) => {
              clusterMap[clusterId] = [...(clusterMap[clusterId] || []), sent];
            });

            const clusterizedAnswers = Object.assign(
              {},
              ...Object.keys(clusterMap).map((clusterId) => ({
                [clusterId]: clusterMap[clusterId].reduce((acc, sent) => {
                  return [
                    ...acc,
                    ...answers.filter((ans) => ans.answer === sent),
                  ]
                    .reduce((acc, ans) => {
                      // filter out duplicate results (same URL)
                      return acc.findIndex(
                        (a) => a.source?.about === ans.source?.about,
                      ) > -1
                        ? acc
                        : [...acc, ans];
                    }, [])
                    .sort((a, b) =>
                      a.score > b.score ? -1 : a.score === b.score ? 0 : 1,
                    );
                }, []),
              })),
            );

            const sortedClusters = Object.values(
              clusterizedAnswers,
            ).sort((batchA, batchB) =>
              batchA[0]?.score > batchB[0]?.score
                ? -1
                : batchA[0]?.score === batchB[0]?.score
                ? 0
                : 1,
            );

            console.log('ans', {
              answers,
              clusters,
              // aboveThresholdAnswers,
              clusterMap,
              clusterizedAnswers,
              sortedClusters,
            });

            dispatch({
              type: 'loaded',
              data: { clusters, answers: validAnswers, sortedClusters },
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
      cutoff,
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
