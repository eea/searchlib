import React from 'react';
import { withSearch } from '@elastic/react-search-ui';
import { useAppConfig } from '@eeacms/search/lib/hocs/appConfig';

const useBackendSearch = async (query) => {
  const resp = await fetch(query);
  return resp;
};

const _withAnswers = (WrappedComponent) => {
  const WithSearchComponent = (props) => {
    const { searchContext } = props;
    const answers = [];
    const { appConfig } = useAppConfig();
    console.log({ appConfig, searchContext });
    // const query = '';
    // const search = useBackendSearch(query);
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
          <li>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default withAnswers(AnswersList);
