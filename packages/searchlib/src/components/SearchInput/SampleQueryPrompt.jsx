import React from 'react';
import { useSearchContext, useAppConfig } from '@eeacms/search/lib/hocs';
import { Button } from 'semantic-ui-react';

export default function SampleQueryPrompt() {
  const { appConfig } = useAppConfig();
  const { setSearchTerm } = useSearchContext();

  const { promptQueries, promptQueryInterval = 10000 } = appConfig;
  let queries;
  if (typeof promptQueries === 'string') {
    queries = (promptQueries || '').split('\n').filter((n) => !!n.trim());
  } else if (Array.isArray(promptQueries)) {
    queries = promptQueries;
  }
  const nrQueries = queries.length;
  // console.log(appConfig.promptQueries);

  const randomizer = React.useCallback(
    () => Math.max(Math.ceil(Math.random() * nrQueries) - 1, 0),
    [nrQueries],
  );
  const [index, setIndex] = React.useState(randomizer());

  React.useEffect(() => {
    const timer = setInterval(() => {
      const next = randomizer();
      setIndex(next);
    }, promptQueryInterval);
    return () => clearInterval(timer);
  });

  return promptQueries ? (
    <p className="demo-question">
      <span>Try: </span>
      <Button
        as="a"
        basic
        onClick={(evt) => {
          evt.preventDefault();
          // setTriedDemoQuestion(true);
          setSearchTerm(queries[index]);
        }}
        key={queries[index]}
      >
        {queries[index]}
      </Button>
    </p>
  ) : null;
}
