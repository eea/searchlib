import React from 'react';
import {
  Button,
  Form,
  Modal,
  Radio,
  Header,
  TextArea,
  Segment,
} from 'semantic-ui-react';
import { Icon } from '@eeacms/search/components';
import runRequest from '@eeacms/search/lib/runRequest';
import { useAppConfig } from '@eeacms/search/lib/hocs';

import { buildFeedbackRequest } from './buildRequest';

const feedbacks = [
  { id: 'helpful', title: 'This is helpful' },
  { id: 'innacurate', title: 'This is misleading or innaccurate' },
  // {
  //   id: 'wrongpassage',
  //   title: 'The document is correct but the marked answer is wrong',
  // },
];

// if button_col1.button("👍", key=f"{result['context']}{count}1", help="Correct answer"):
//     is_correct_answer=True
//     is_correct_document=True
//
// if button_col2.button("👎", key=f"{result['context']}{count}2", help="Wrong answer and wrong passage"):
//     is_correct_answer=False
//     is_correct_document=False
//
// if button_col3.button("👎👍", key=f"{result['context']}{count}3", help="Wrong answer, but correct passage"):
//     is_correct_answer=False
//     is_correct_document=True

const AnswerFeedback = (props) => {
  const [open, setOpen] = React.useState(false);
  const [think, setThink] = React.useState('');
  const { basic, answer, query } = props;

  const { appConfig } = useAppConfig();

  const submitFeedback = React.useCallback(async () => {
    const state = { answer, query };
    const req = buildFeedbackRequest(state, appConfig);
    console.log('request', req);
    const res = await runRequest(req, appConfig);
    console.log('res', res);
  }, [appConfig, answer, query]);

  return (
    <Modal
      open={open}
      trigger={
        <Button basic={basic} size="mini" onClick={() => setOpen(true)}>
          <Icon name="comment" />
          Feedback
        </Button>
      }
    >
      <Modal.Header>What do you think?</Modal.Header>
      <Modal.Content>
        <Form>
          {feedbacks.map(({ id, title }) => (
            <Form.Field key={id}>
              <Radio
                name="feedback"
                label={title}
                checked={id === think}
                onChange={() => setThink(id)}
              />
            </Form.Field>
          ))}
          <Header as="h4">Comments or suggestions?</Header>
          <Form.Field>
            <TextArea placeholder="Optional"></TextArea>
          </Form.Field>
        </Form>
        <Segment>
          <p>
            The data you provide helps improve EEA Global Search.{' '}
            <a href="https://eea.europa.eu">Learn more</a>
          </p>
        </Segment>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          content="Send feedback"
          labelPosition="right"
          icon="checkmark"
          onClick={() => {
            submitFeedback(answer, feedbacks);
            setOpen(false);
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
};

export default AnswerFeedback;
