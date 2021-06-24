import React from 'react';
import { Icon, Button } from 'semantic-ui-react';
import cx from 'classnames';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

const MicrophoneInput = ({ onChange }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  console.log('listening', listening);
  const timeoutRef = React.useRef();

  React.useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (transcript) {
        onChange(transcript);
        resetTranscript();
      }
    }, 1000);

    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, [onChange, resetTranscript, transcript]);

  if (!browserSupportsSpeechRecognition) {
    return '';
  }

  return (
    <Button
      className={cx('microphone-input', { listening })}
      icon={<Icon name={cx('microphone', { slash: listening })} />}
      onClick={() => {
        console.log('clicked');
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
