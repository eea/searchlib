import React from 'react';
import { useSearchContext, useAppConfig } from '@eeacms/search/lib/hocs';
import { Modal, Button, Icon, List } from 'semantic-ui-react';

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
  const { setSearchTerm, setSort, resetFilters } = useSearchContext();
  const [showModal, setShowModal] = React.useState();

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

  const applyQuery = React.useCallback(
    (text) => {
      resetFilters();
      setSearchTerm(text, { shouldClearFilters: false });
      setSort('', '');
    },
    [resetFilters, setSearchTerm, setSort],
  );

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
          applyQuery(queries[index]);
        }}
        key={queries[index]}
      >
        {queries[index]}
      </Button>

      <Button
        className="explore-more-queries"
        compact
        inverted
        as="a"
        onClick={(e) => {
          setShowModal(true);
          e.preventDefault();
          e.stopPropagation();
        }}
        onKeyDown={() => {}}
      >
        Explore more queries
        <Icon name="caret down" />
      </Button>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        onOpen={() => setShowModal(true)}
      >
        <Modal.Header>Pick one of our sample questions</Modal.Header>
        <Modal.Content scrolling>
          <List>
            {queries.map((text, i) => (
              <List.Item key={i}>
                <List.Content>
                  <List.Header
                    as="a"
                    onClick={() => {
                      setShowModal(false);
                      applyQuery(text);
                    }}
                    onKeyDown={() => {
                      setShowModal(false);
                      applyQuery(text);
                    }}
                  >
                    {text}
                  </List.Header>
                </List.Content>
              </List.Item>
            ))}
          </List>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    </p>
  ) : null;
}
