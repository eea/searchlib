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
}) {
  const inputProps = getInputProps();
  const { filters, addFilter, setFilter, ...domProps } = inputProps;
  const { searchPhrases, setSearchPhrases } = useAppConfig();

  // const searchPhrases = inputProps.value.split('|') || [];
  console.log('input props', domProps.className);
  const inpRef = React.useRef();

  React.useEffect(() => {
    console.log('efffocus', inpRef.current);
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
                    setSearchPhrases(
                      searchPhrases.filter((ph) => ph !== phrase),
                    );
                  }}
                />
              </Label>
            ),
        )}

        <input
          {...domProps}
          ref={inpRef}
          className=""
          onChange={(e) => {
            inputProps.onChange(e);
            // console.log('got value', value);
            // const val = searchPhrases.join('|');
            // // console.log('val', val);
            // onChange(val);
          }}
          onBlur={() => {
            console.log('blur?');
          }}
          onKeyDown={(ev) => {
            // inputProps.onKeyDown(ev, data);

            if (ev.key === 'Enter') {
              const { value } = inputProps;
              setSearchPhrases([...searchPhrases, value]);
              // searchPhrases.push(value);
              // debugger;
              // addFilter('searchPhrases', searchPhrases, 'searchPhrases');
              // console.log(searchPhrases);
              // ev.nativeEvent.stopImmediatePropagation();
              // ev.stopPropagation();
              setTimeout(() => {
                inpRef.current && inpRef.current.focus();
                console.log('focus');
              }, 1000);
              onChange('');
            }
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
