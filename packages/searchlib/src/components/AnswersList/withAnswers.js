import React from 'react';
import { withSearch } from '@elastic/react-search-ui';
import { useAppConfig } from '@eeacms/search/lib/hocs/appConfig';
import runRequest from '@eeacms/search/lib/runRequest';
import buildQuestionRequest from './buildQuestionRequest';

const _withAnswers = (WrappedComponent) => {
  const WithSearchComponent = (props) => {
    const { searchContext } = props;
    const { searchTerm = '' } = searchContext;
    const { appConfig } = useAppConfig();

    const timeoutRef = React.useRef();
    const [answers, setAnswers] = React.useState();
    const [loading, setLoading] = React.useState(false);
    const [loaded, setLoaded] = React.useState(false);
    const [searchedTerm, setSearchedTerm] = React.useState();

    React.useEffect(() => {
      const timeoutRefCurrent = timeoutRef.current;
      if (timeoutRefCurrent) clearInterval(timeoutRef.current);

      if (searchTerm && searchTerm.trim().indexOf(' ') > -1) {
        timeoutRef.current = setTimeout(() => {
          const requestBody = buildQuestionRequest(searchContext, appConfig);

          setSearchedTerm(searchTerm);
          setLoading(true);
          setLoaded(false);

          runRequest(requestBody, appConfig).then((response) => {
            const { body } = response;
            console.log('aset answers', body.answers);
            setAnswers(body.answers);
            setLoading(false);
            setLoaded(true);
          });
        }, 1000);
      }

      return () => timeoutRefCurrent && clearInterval(timeoutRefCurrent);
    }, [appConfig, searchContext, searchTerm]);

    return (
      <WrappedComponent
        answers={answers}
        loading={loading}
        loaded={loaded}
        searchedTerm={searchedTerm}
        {...props}
      />
    );
  };
  return WithSearchComponent;
};

const withAnswers = (WrappedComponent) =>
  withSearch((context) => ({ searchContext: context }))(
    _withAnswers(WrappedComponent),
  );

export default withAnswers;
