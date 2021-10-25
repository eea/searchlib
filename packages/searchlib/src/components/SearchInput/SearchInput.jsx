/**
 * An advanced search input box. Features:
 * - autocomplete
 * - voice input
 * - search phrases
 */
import React from 'react';
import { Button, Label, Icon } from 'semantic-ui-react';
import MicrophoneInput from '../MicrophoneInput/MicrophoneInput';
import ExactPhrasesFacet from './ExactPhrasesFacet';
import IncludeArchivedFacet from './IncludeArchivedFacet';
import { useAtom } from 'jotai';
import { showExtraFacetsAtom } from './state';

function SearchInput({
  getAutocomplete,
  getButtonProps,
  getInputProps,
  onChange,
  onSubmit,
  mode,
}) {
  const inputProps = getInputProps();
  const { filters, addFilter, setFilter, ...domProps } = inputProps;
  const searchTerm = inputProps.value;

  const searchPhrases = inputProps.value.split('|') || []; //.filter((p) => !!p);
  const currentTerm = searchPhrases.pop();

  const inpRef = React.useRef();
  const [showExtraFacets, setShowExtraFacets] = useAtom(showExtraFacetsAtom);

  React.useEffect(() => {
    mode === 'view' && inpRef.current && inpRef.current.focus();
  }, [searchTerm, mode]);

  return (
    <>
      <div className="search-input">
        <div className="terms-box">
          <div className="search-terms">
            {searchPhrases.map(
              (phrase, i) =>
                phrase &&
                phrase.trim() && (
                  <Label key={i} className="search-phrase">
                    {phrase}{' '}
                    <Icon
                      onClick={(e) => {
                        e.preventDefault();
                        onSubmit(
                          e,
                          [
                            ...searchPhrases.filter((p) => p !== phrase),
                            currentTerm,
                          ].join('|'),
                          {
                            deleteOneTerm: true,
                          },
                        );

                        setTimeout(() => {
                          inpRef.current && inpRef.current.focus();
                        }, 500);
                      }}
                      name="trash"
                      size="small"
                    />
                  </Label>
                ),
            )}
          </div>

          <Icon name="search" size="large" color="grey" />

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
                onClick={(e) => onSubmit(e, '', { clearSearchTerm: true })}
              />
            </div>
          )}

          {getAutocomplete()}
        </div>
        <div className="input-controls">
          <Button
            icon
            className="show-extra-facets"
            onClick={() => {
              setShowExtraFacets(!showExtraFacets);
            }}
          >
            <Icon name="sliders" />
          </Button>

          <MicrophoneInput onChange={onChange} />
        </div>
      </div>

      {showExtraFacets ? (
        <div className="extra-facets">
          {searchPhrases.length > 0 &&
            searchPhrases.find((phrase) => phrase.indexOf(' ') > -1) && (
              <ExactPhrasesFacet />
            )}
          <IncludeArchivedFacet />
        </div>
      ) : null}
    </>
  );
}

export default SearchInput;
