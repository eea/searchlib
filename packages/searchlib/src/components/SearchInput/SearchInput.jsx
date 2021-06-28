import React from 'react';
import { Label, Icon } from 'semantic-ui-react';
import MicrophoneInput from '../MicrophoneInput/MicrophoneInput';
import ExactPhrasesFacet from './ExactPhrasesFacet';
import IncludeArchivedFacet from './IncludeArchivedFacet';

function SearchInput({
  getAutocomplete,
  getButtonProps,
  getInputProps,
  onChange,
  onSubmit,
}) {
  const inputProps = getInputProps();
  const { filters, addFilter, setFilter, ...domProps } = inputProps;
  const searchTerm = inputProps.value;

  const searchPhrases = inputProps.value.split('|') || []; //.filter((p) => !!p);
  const currentTerm = searchPhrases.pop();

  const inpRef = React.useRef();

  React.useEffect(() => {
    inpRef.current && inpRef.current.focus();
  }, [searchTerm]);

  return (
    <>
      <div className="search-input">
        <Icon name="search" size="large" color="grey" />
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
            let {
              target: { value },
            } = event;
            value = [...searchPhrases, value].join('|');
            inputProps.onChange({ target: { value } });
          }}
          onKeyDown={(ev) => {
            if (ev.key === 'Backspace') {
              if (currentTerm === '' && searchPhrases.length > 0) {
                const lastPhrase = searchPhrases[searchPhrases.length - 1];
                const fakeEvent = {
                  target: {
                    value: `${searchPhrases
                      .slice(0, searchPhrases.length - 1)
                      .join('|')}|${lastPhrase}`,
                  },
                };
                ev.preventDefault();
                inputProps.onChange(fakeEvent);
                return;
              }
            }

            return inputProps.onKeyDown(ev);
          }}
          onBlur={() => {
            // console.log('blur?');
          }}
        />

        {(searchPhrases.filter((p) => !!p).length > 0 || currentTerm) && (
          <div className="ui button basic">
            <Icon
              name="delete"
              role="button"
              onClick={(e) => onSubmit(e, '')}
            />
          </div>
        )}

        <MicrophoneInput onChange={onChange} />
      </div>

      {getAutocomplete()}

      <div className="extra-facets">
        {searchPhrases.length > 0 &&
          searchPhrases.find((phrase) => phrase.indexOf(' ') > -1) && (
            <ExactPhrasesFacet />
          )}
        <IncludeArchivedFacet />
      </div>
    </>
  );
}

export default SearchInput;
