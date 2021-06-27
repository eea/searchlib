import React from 'react';
import { Label, Icon } from 'semantic-ui-react';
import MicrophoneInput from '../MicrophoneInput/MicrophoneInput';
import { useAppConfig } from '@eeacms/search/lib/hocs';

// sui-search-box__wrapper
function SearchInput({
  getAutocomplete,
  getButtonProps,
  getInputProps,
  onChange,
  setSearchTerm,
}) {
  const inputProps = getInputProps();
  // console.log(inputProps);
  const { filters, addFilter, setFilter, ...domProps } = inputProps;

  const searchPhrases = inputProps.value.split('|') || [];
  const currentTerm = searchPhrases.pop();

  const inpRef = React.useRef();

  React.useEffect(() => {
    inpRef.current && inpRef.current.focus();
  }, []);

  return (
    <>
      <div className="search-input">
        {searchPhrases.map(
          (phrase, i) =>
            phrase &&
            phrase.trim() && (
              <Label key={i} className="search-phrase">
                {phrase}{' '}
                <Icon
                  name="delete"
                  role="button"
                  onClick={() => {
                    setSearchTerm([searchPhrases.join('|'), currentTerm]);
                  }}
                />
              </Label>
            ),
        )}

        <input
          {...domProps}
          value={currentTerm}
          ref={inpRef}
          className=""
          onChange={(event) => {
            let {
              target: { value },
            } = event;
            value = [...searchPhrases, value].join('|');
            // console.log('value', value);
            inputProps.onChange({ target: { value } });
          }}
          onKeyDown={(ev) => {
            if (ev.key === 'Enter') {
              setTimeout(() => {
                inpRef.current && inpRef.current.focus();
                // console.log('focus');
              }, 1000);
              const value = `${[...searchPhrases, currentTerm].join('|')}|`;
              inputProps.onChange({ target: { value } });
            }
          }}
          onBlur={() => {
            // console.log('blur?');
          }}
        />

        <div className="ui button basic">
          <Icon name="delete" role="button" onClick={() => onChange('')} />
        </div>

        <MicrophoneInput onChange={onChange} />
      </div>

      {getAutocomplete()}
    </>
  );
}

export default SearchInput;

// console.log('got value', value);
// const val = searchPhrases.join('|');
// // console.log('val', val);
// onChange(val);
// inputProps.onKeyDown(ev, data);

// setSearchPhrases([...searchPhrases, value]);
// searchPhrases.push(value);
// debugger;
// addFilter('searchPhrases', searchPhrases, 'searchPhrases');
// console.log(searchPhrases);
// ev.nativeEvent.stopImmediatePropagation();
// ev.stopPropagation();
