import React from 'react';
import { Input } from 'semantic-ui-react';
import MicrophoneInput from '../MicrophoneInput/MicrophoneInput';

// sui-search-box__wrapper
function SearchInput({
  getAutocomplete,
  getButtonProps,
  getInputProps,
  onChange,
}) {
  return (
    <>
      <Input
        {...getInputProps()}
        icon={
          <>
            <MicrophoneInput onChange={onChange} />
            {getAutocomplete()}
          </>
        }
        className=""
      ></Input>
    </>
  );
}

export default SearchInput;
