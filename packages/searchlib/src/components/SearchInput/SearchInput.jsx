import React from 'react';
// import { Input } from 'semantic-ui-react';
import MicrophoneInput from '../MicrophoneInput/MicrophoneInput';

// sui-search-box__wrapper
function SearchInput({
  getAutocomplete,
  getButtonProps,
  getInputProps,
  onChange,
}) {
  const inputProps = getInputProps();
  return (
    <>
      <div className="search-input">
        <input
          {...inputProps}
          className=""
          onKeyDown={(ev, data) => {
            ev.nativeEvent.stopImmediatePropagation();
            ev.stopPropagation();
            console.log(ev, data);
            inputProps.onKeyDown(ev, data);
          }}
        />
        <MicrophoneInput onChange={onChange} />
      </div>
      {getAutocomplete()}
    </>
  );
}

export default SearchInput;
