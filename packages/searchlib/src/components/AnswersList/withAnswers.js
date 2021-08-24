import React from 'react';
import { useAppConfig, useSearchContext } from '@eeacms/search/lib/hocs';
import runRequest from '@eeacms/search/lib/runRequest';
import buildQuestionRequest from './buildQuestionRequest';

// import { WithSearch } from '@elastic/react-search-ui'; // withSearch,
// import { SearchContext } from '@elastic/react-search-ui';

const SearchAnswersImpl = ({ view, wrappedProps }) => {
  const searchContext = useSearchContext();
  // const searchContext = React.useContext(SearchContext);
  console.log('searchContext', searchContext);

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

    return () => {
      console.log('unmount');
      return timeoutRefCurrent && clearInterval(timeoutRefCurrent);
    };
  }, [appConfig, searchContext, searchTerm]);

  const View = view;

  return (
    <View
      {...wrappedProps}
      answers={answers}
      loading={loading}
      loaded={loaded}
      searchedTerm={searchedTerm}
      searchContext={searchContext}
    />
  );
};

const _withAnswers = (WrappedComponent) => {
  return (props) => (
    <SearchAnswersImpl view={WrappedComponent} wrappedProps={props} />
  );
};

// const withAnswers = (WrappedComponent) =>
//   withSearch((context) => ({ searchContext: context }))(
//     _withAnswers(WrappedComponent),
//   );
//
//  <WithSearch mapContextToProps={(context) => ({ searchContext: context })}>
//    {(searchProps) => {
//      console.log('searchProps', searchProps);
//      return <SearchAnswersImpl view={WrappedComponent} {...searchProps} />;
//    }}
//  </WithSearch>

export default _withAnswers;
