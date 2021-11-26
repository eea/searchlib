import React from 'react';

import {
  Segment,
  Rating,
  Popup,
  Button,
  Icon,
  Accordion,
} from 'semantic-ui-react'; //, Accordion

import { SegmentedBreadcrumb } from '@eeacms/search/components';
import { ExternalLink } from '@eeacms/search/components/Result/HorizontalCardItem';
import { buildResult } from '@eeacms/search/lib/search/state/results';
import { useAppConfig, usePrevious } from '@eeacms/search/lib/hocs';
import { DateTime } from '@eeacms/search/components'; //, StringList

import AnswerBoxDetails from './AnswerBoxDetails';
import AnswerLinksList from './AnswersLinksList';

import { highlightUrl } from './utils';
import withAnswers from './withAnswers';

const AnswerContext = ({ item, answerItem }) => {
  const { full_context, answer } = answerItem;

  const start = (full_context || '').indexOf(answer);

  const pre = full_context
    ? full_context.slice(0, start)
    : item.context.slice(0, item.offset_start);
  const ans = full_context
    ? answer
    : item.context.slice(item.offset_start, item.offset_end);
  const post = full_context
    ? full_context.slice(start + answer.length, full_context.length)
    : item.context.slice(item.offset_end, item.context.length);

  return (
    <div className="answer__primary">
      {pre}
      <ExternalLink href={highlightUrl(item.href, ans)}>{ans}</ExternalLink>
      {post} (<DateTime format="DATE_MED" value={item.issued} />)
      <h4 className="answer__primarylink">
        <ExternalLink href={highlightUrl(item.href, ans)}>
          <SegmentedBreadcrumb href={item.href} />
          <Icon name={item.clusterIcon} />
          {item.title}
        </ExternalLink>
      </h4>
    </div>
  );
};

const AnswersList = (props) => {
  const { appConfig } = useAppConfig();
  const [showExpanded, setShowExpanded] = React.useState(false);
  const { data = {}, loading, loaded, searchedTerm } = props;
  const { answers = [], predictions, clusters } = data || {};
  const { searchContext } = props;
  const { searchTerm = '' } = searchContext;
  const previousSearchTerm = usePrevious(searchTerm);
  /*
answer: "organoleptic factors, physico-chemical factors, toxic substances, microbiological parameters"
context: "nto account when assessing water quality (organoleptic factors, physico-chemical factors, toxic substances, microbiological parameters.↵(Source: RRDA)"
document_id: "http://www.eea.europa.eu/help/glossary/gemet-environmental-thesaurus/total-parameter"
id: "http://www.eea.europa.eu/help/glossary/gemet-environmental-thesaurus/total-parameter"
offset_end: 134
offset_end_in_doc: 176
offset_start: 42
offset_start_in_doc: 84
probability: 0.752453625202179
question: null
score: 6.118757247924805
*/
  //
  let cutoff = 0.1;
  try {
    cutoff = parseFloat(appConfig.nlp.qa.cutoffScore ?? 0.1);
  } catch {
    cutoff = 0.1;
  }
  const showLoader = loading && !loaded;
  const filtered = answers?.filter((item) => item.score >= cutoff);

  const primaryAnswer = filtered?.[0];
  const primaryResult = primaryAnswer
    ? buildResult(
        { ...primaryAnswer, _source: primaryAnswer?.source },
        appConfig,
      )
    : null;

  React.useEffect(() => {
    if (previousSearchTerm && previousSearchTerm !== searchTerm) {
      setShowExpanded(false);
    }
  }, [previousSearchTerm, searchTerm]);

  return (
    <div className="answers-list">
      {showLoader ? (
        <Segment className="answers__loading">
          <div className="loading-tip">Searching for direct answers...</div>
          <div className="progress">
            <div className="color"></div>
          </div>
        </Segment>
      ) : searchTerm && searchedTerm === searchTerm && filtered?.length ? (
        <>
          <Segment className="answers-wrapper">
            <div className="answerCard">
              {/* <h3 className="answers__directAnswer">{filtered[0].answer}</h3> */}
              <AnswerContext item={primaryResult} answerItem={primaryAnswer} />
            </div>

            <Accordion>
              <Accordion.Title index={0} active={showExpanded}>
                <div className="answers__bottom">
                  <Rating
                    rating={Math.round(5 * primaryAnswer.score)}
                    maxRating={5}
                    size="mini"
                    disabled
                  />
                  <div className="answers__bottom__spacer"></div>
                  <Button
                    basic
                    size="mini"
                    onClick={() => setShowExpanded(!showExpanded)}
                    disabled={filtered.slice(1).length === 0}
                  >
                    <Icon name="dropdown" />
                    More
                  </Button>
                  <div className="answers__bottom__spacer"></div>
                  <Popup
                    trigger={
                      <Button basic size="mini">
                        Direct answer
                      </Button>
                    }
                  >
                    <AnswerBoxDetails />
                  </Popup>
                </div>
              </Accordion.Title>
              <Accordion.Content active={showExpanded}>
                <div className="answers__links">
                  <AnswerLinksList
                    appConfig={appConfig}
                    filtered={showExpanded ? filtered.slice(1) : []}
                  />
                </div>
              </Accordion.Content>
            </Accordion>
          </Segment>
        </>
      ) : (
        ''
      )}
    </div>
  );
};

export default withAnswers(AnswersList);
