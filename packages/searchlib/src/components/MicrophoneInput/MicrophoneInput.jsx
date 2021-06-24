import React from 'react';
import { Icon, Button } from 'semantic-ui-react';
import cx from 'classnames';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
// import usePrevious from '@eeacms/search/lib/hocs/usePrevious';
// const prevTranscript = usePrevious(transcript);

const MicrophoneInput = ({ onChange }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const timeoutRef = React.useRef();

  React.useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (transcript) {
        console.log('onchange', transcript);
        onChange(transcript);
        resetTranscript();
      }
    }, 1000);

    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
      console.log('cleanup');
    };
  }, [onChange, resetTranscript, transcript]);

  if (!browserSupportsSpeechRecognition) {
    return '';
  }

  return (
    <Button
      className={cx('microphone-input', { listening })}
      icon={<Icon name={cx('microphone', { slash: !listening })} />}
      onClick={() => {
        if (!listening) {
          SpeechRecognition.startListening();
        } else {
          SpeechRecognition.stopListening();
        }
      }}
    ></Button>
  );
};

export default MicrophoneInput;
