import React from 'react';
import { useAppConfig, useSearchContext } from '@eeacms/search/lib/hocs';
import runRequest from '@eeacms/search/lib/runRequest';
import {
  buildQuestionRequest,
  buildClassifyQuestionRequest,
} from './buildRequest';
import { requestFamily } from './state';
import { useAtom } from 'jotai';

const timeoutRef = {};

const withAnswers = (WrappedComponent) => {
  const Wrapped = (props) => {
    const searchContext = useSearchContext();

    const { searchTerm = '', query_type } = searchContext;
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
    // console.log('requestAtom', request, searchedTerm, searchTerm);

    React.useEffect(() => {
      const timeoutRefCurrent = timeoutRef.current;
      if (timeoutRefCurrent) clearInterval(timeoutRef.current);

      const shouldRunSearch = searchTerm; // && searchTerm.trim().indexOf(' ') > -1;

      if (shouldRunSearch) {
        timeoutRef.current = setTimeout(async () => {
          const { loading, loaded } = request;
          // const classifyQuestionBody = buildClassifyQuestionRequest(
          //   searchContext,
          //   appConfig,
          // );
          // const resp = await runRequest(classifyQuestionBody, appConfig);
          // console.log('classify resp', { classifyQuestionBody, resp });

          const requestBody = buildQuestionRequest(searchContext, appConfig);
          console.log('query_type', query_type);

          // TODO: this might not be perfect, can be desynced
          if (!(loading || loaded) && qa_queryTypes.indexOf(query_type) > -1) {
            console.log('run answers request', requestBody);
            dispatch({ type: 'loading' });
            runRequest(requestBody, appConfig).then((response) => {
              const { body } = response;
              dispatch({ type: 'loaded', data: body.answers });
              setSearchedTerm(searchTerm);
            });
          }
        }, 2000);
      }
    }, [
      appConfig,
      searchContext,
      searchTerm,
      qa_queryTypes,
      query_type,
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
