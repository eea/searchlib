import React from 'react';
import { withSearch } from '@elastic/react-search-ui';
import { useAppConfig } from '@eeacms/search/lib/hocs/appConfig';

const useBackendSearch = async (query) => {
  const resp = await fetch(query);
  return resp;
};

// const withAnswers = withSearch((context) => context)((WrappedComponent) => {
//   // const { appConfig } = useAppConfig();
//   // const query = '';
//   // const search = useBackendSearch(query);
//   const answers = [];
//   return (props) => <WrappedComponent answers={answers} {...props} />;
// });

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

export default AnswersList;
