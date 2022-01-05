import React from 'react';
import { useSearchContext, useAppConfig } from '@eeacms/search/lib/hocs';
import { Button } from 'semantic-ui-react';

function toArray(s) {
  let a = [];
  if (typeof s === 'string') {
    a = (s || '').split('\n').filter((n) => !!n.trim());
  } else if (Array.isArray(s)) {
    a = s;
  }
  return a;
}

export default function SampleQueryPrompt() {
  const { appConfig } = useAppConfig();
  const { setSearchTerm, setSort } = useSearchContext();

  const {
    defaultPromptQueries = [],
    promptQueries,
    promptQueryInterval = 10000,
  } = appConfig;

  const pqa = toArray(promptQueries);
  const dpqa = toArray(defaultPromptQueries);

  const queries = pqa.length ? pqa : dpqa.length ? dpqa : [];

  const nrQueries = queries.length;

  const randomizer = React.useCallback(
    () => Math.max(Math.ceil(Math.random() * nrQueries) - 1, 0),
    [nrQueries],
  );
  const [index, setIndex] = React.useState(randomizer());
  const [paused, setPaused] = React.useState(false);
  const timerRef = React.useRef();

  React.useEffect(() => {
    timerRef.current = setInterval(() => {
      const next = randomizer();
      if (!paused) setIndex(next);
    }, promptQueryInterval);
    return () => clearInterval(timerRef.current);
  }, [paused, promptQueryInterval, randomizer]);

  return queries.length ? (
    <p className="demo-question">
      <span>Try searching for: </span>
      <Button
        as="a"
        basic
        onMouseOver={() => setPaused(true)}
        onMouseOut={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onClick={(evt) => {
          evt.preventDefault();
          // setTriedDemoQuestion(true);
          setSearchTerm(queries[index]);
          setSort('', '');
        }}
        key={queries[index]}
      >
        {queries[index]}
      </Button>
    </p>
  ) : null;
}
