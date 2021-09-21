import React from 'react';
import { useAppConfig, useSearchContext } from '@eeacms/search/lib/hocs';
import runRequest from '@eeacms/search/lib/runRequest';
import buildQuestionRequest from './buildQuestionRequest';
import { requestFamily } from './state';
import { useAtom } from 'jotai';

const timeoutRef = {};

const withAnswers = (WrappedComponent) => {
  const Wrapped = (props) => {
    const searchContext = useSearchContext();

    const { searchTerm = '' } = searchContext;
    const { appConfig } = useAppConfig();
    const [searchedTerm, setSearchedTerm] = React.useState();

    const requestAtom = requestFamily(searchTerm);
    const [request, dispatch] = useAtom(requestAtom);

    React.useEffect(() => {
      const timeoutRefCurrent = timeoutRef.current;
      if (timeoutRefCurrent) clearInterval(timeoutRef.current);

      const shouldRunSearch = searchTerm && searchTerm.trim().indexOf(' ') > -1;

      if (shouldRunSearch) {
        timeoutRef.current = setTimeout(() => {
          const { loading, loaded } = request;
          if (!(loading || loaded)) {
            const requestBody = buildQuestionRequest(searchContext, appConfig);

            console.log('run asnwers request', requestBody);
            dispatch({ type: 'loading' });
            runRequest(requestBody, appConfig).then((response) => {
              const { body } = response;
              dispatch({ type: 'loaded', data: body.answers });
              setSearchedTerm(searchTerm);
            });
          }
        }, 2000);
      }
    }, [appConfig, searchContext, searchTerm, dispatch, request]);

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
