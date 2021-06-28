import React from 'react';
import { Label, Icon } from 'semantic-ui-react';
import MicrophoneInput from '../MicrophoneInput/MicrophoneInput';
// import { useAppConfig } from '@eeacms/search/lib/hocs';

function getSearchValue(currentTerm, searchPhrases) {
  return { target: { value: [...searchPhrases, currentTerm].join('|') } };
}

// sui-search-box__wrapper
function SearchInput({
  getAutocomplete,
  getButtonProps,
  getInputProps,
  onChange,
  onSubmit,
  // setSearchTerm,
}) {
  const inputProps = getInputProps();
  // console.log(inputProps);
  const { filters, addFilter, setFilter, ...domProps } = inputProps;

  const searchPhrases = inputProps.value.split('|') || []; //.filter((p) => !!p);
  const currentTerm = searchPhrases.pop();
  // console.log('searchPhrases', searchPhrases);

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
                  onClick={(e) => {
                    onSubmit(
                      e,
                      [
                        ...searchPhrases.filter((p) => p !== phrase),
                        currentTerm,
                      ].join('|'),
                    );

                    setTimeout(() => {
                      inpRef.current && inpRef.current.focus();
                      // console.log('focus');
                    }, 500);
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
            // console.log('onchange', event);
            let {
              target: { value },
            } = event;
            value = [...searchPhrases, value].join('|');
            // console.log('value', value);
            inputProps.onChange({ target: { value } });
          }}
          onKeyDown={(ev) => {
            // const handled = inputProps.onKeyDown(ev);
            // console.log('handled', handled);

            // if (ev.key === 'Enter') {
            //   setTimeout(() => {
            //     inpRef.current && inpRef.current.focus();
            //     // console.log('focus');
            //   }, 1000);
            //   inputProps.onChange({
            //     target: {
            //       value: `${[...searchPhrases, currentTerm].join('|')}|`,
            //     },
            //   });
            //   return;
            // }

            if (ev.key === 'Backspace') {
              if (currentTerm === '' && searchPhrases.length > 0) {
                const fakeEvent = {
                  target: {
                    value: `${searchPhrases
                      .slice(0, searchPhrases.length - 1)
                      .join('|')}|`,
                  },
                };
                inputProps.onChange(fakeEvent);
                return;
              }
            }

            // return inputProps.onKeyDown(ev);
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
