import React from 'react';
import { Popup } from 'semantic-ui-react';
import AnswerFeedback from './AnswerFeedback';

export default () => (
  <>
    <Popup.Header>Direct answers</Popup.Header>
    <Popup.Content>
      <p>
        Sometimes we show direct answers to your queries when our AI algorithm
        automatically detects them within the top search results.
      </p>

      <p>
        Some answers may not be correct or up to date, they may be based on
        obsolete content. Therefore, we appreciate your <AnswerFeedback /> to
        help us improve.
      </p>

      <p>
        Our goal is to keep this information and material timely and accurate.
        If errors are brought to our attention, we will try to correct them.
      </p>

      <p>
        <a
          href="https://www.eea.europa.eu/legal/disclaimer"
          target="_blank"
          rel="noreferrer"
        >
          EEA Disclaimer
        </a>
      </p>
    </Popup.Content>
  </>
);
