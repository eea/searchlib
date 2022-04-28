import React from 'react';
import { Segment, Rating, Popup, Button, Message } from 'semantic-ui-react'; //, Accordion

// import { Icon } from '@eeacms/search/components'; //, StringList//, Toast
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { buildResult } from '@eeacms/search/lib/search/state/results';

import AnswerContext from './AnswerContext';
import AnswerBoxDetails from './AnswerBoxDetails';
import AnswerLinksList from './AnswersLinksList';
import AnswerFeedback from './AnswerFeedback';

const MAX_COUNT = 1;

const Answers = (props) => {
  const { appConfig } = useAppConfig();
  const { data = {}, searchedTerm, hasActiveFilters, resetFilters } = props;
  const { sortedClusters = [] } = data || {};
  const [position, setPosition] = React.useState(0);

  const ExtractMessageWarning = React.useMemo(() => {
    return () => (
      <Message warning>
        This answer is extracted from documents matching the active filters. You
        can{' '}
        <Button
          size="mini"
          compact
          primary
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            resetFilters();
          }}
        >
          reset
        </Button>{' '}
        the filters to improve the quality of results.
      </Message>
    );
  }, [resetFilters]);

  return (
    <div>
      {sortedClusters.length > 1 && (
        <Button.Group size="mini" floated="right" color="blue">
          <Button
            icon="angle left"
            disabled={position === 0}
            onClick={() => setPosition(position - 1)}
          />
          <Button
            icon="angle right"
            disabled={position === sortedClusters.length - 1}
            onClick={() => setPosition(position + 1)}
          />
        </Button.Group>
      )}
      <div>
        {/* <h2>{searchedTerm}</h2> */}
        {sortedClusters.map((filtered, i) => {
          const primaryAnswer = filtered?.[0];

          if (!primaryAnswer) {
            console.log('no primary answer', sortedClusters);
            return '';
          }

          const primaryResult = primaryAnswer
            ? buildResult(
                { ...primaryAnswer, _source: primaryAnswer?.source },
                appConfig,
              )
            : null;

          return (
            <div key={i} style={{ display: position === i ? 'block' : 'none' }}>
              <Segment className="answers-wrapper">
                <div className="answerCard">
                  {/* <h3 className="answers__directAnswer">{filtered[0].answer}</h3> */}
                  <AnswerContext
                    item={primaryResult}
                    answerItem={primaryAnswer}
                  />
                  <div className="answers__links">
                    <AnswerLinksList
                      appConfig={appConfig}
                      filtered={filtered
                        .slice(1, filtered.length)
                        .slice(1, Math.min(filtered.length, MAX_COUNT))}
                    />
                  </div>
                </div>
                <div className="answers__bottom">
                  <Popup
                    trigger={
                      <Rating
                        rating={Math.round(5 * primaryAnswer.score)}
                        maxRating={5}
                        size="mini"
                        disabled
                      />
                    }
                  >
                    <p>
                      The star scores indicates how confident the search engine
                      is about the accuracy of the answer.{' '}
                    </p>
                    <p>
                      It is not an indication on the quality of the linked
                      document or page.
                    </p>
                  </Popup>
                  <div className="answers__bottom__spacer"></div>
                  <div className="right">
                    <AnswerBoxDetails basic />
                    <AnswerFeedback
                      basic
                      answer={primaryAnswer}
                      query={searchedTerm}
                    />
                  </div>
                </div>
                {hasActiveFilters && <ExtractMessageWarning />}
              </Segment>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Answers;
