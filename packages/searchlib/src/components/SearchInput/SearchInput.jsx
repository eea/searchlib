/**
 * An advanced search input box. Features:
 * - autocomplete
 * - voice input
 * - search phrases
 */
import React from 'react';
import { Icon } from 'semantic-ui-react';

import { useAtom } from 'jotai';
import { showExtraFacetsAtom } from './state';
import { useSearchContext } from '@eeacms/search/lib/hocs';
import SampleQueryPrompt from './SampleQueryPrompt';

// import { useState } from 'react';
// import ExactPhrasesFacet from './ExactPhrasesFacet';
// import IncludeArchivedFacet from './IncludeArchivedFacet';
// import MicrophoneInput from '../MicrophoneInput/MicrophoneInput';

function SearchInput({
  getAutocomplete,
  getButtonProps,
  getInputProps,
  onChange,
  onSubmit,
  mode,
}) {
  const inputProps = getInputProps();
  // console.log('inputProps', inputProps);
  const { setSearchTerm } = useSearchContext();

  const { filters, addFilter, setFilter, ...domProps } = inputProps;
  const searchTerm = inputProps.value;

  const searchPhrases = inputProps.value.split('|') || []; //.filter((p) => !!p);
  const currentTerm = searchPhrases.pop();

  const inpRef = React.useRef();
  const [, setShowExtraFacets] = useAtom(showExtraFacetsAtom);

  React.useEffect(() => {
    mode === 'view' && inpRef.current && inpRef.current.focus();
  }, [searchTerm, mode]);

  return (
    <>
      <div className="search-input">
        <div className="terms-box">
          <div className="terms-box-left">
            <Icon name="search" size="large" color="grey" />
          </div>

          {/*
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
          </div>*/}

          {searchPhrases.length === 0 ? (
            <input
              {...domProps}
              enterkeyhint="search"
              value={currentTerm}
              ref={inpRef}
              className=""
              placeholder={searchPhrases?.length ? null : domProps.placeholder}
              onChange={(event) => {
                setShowExtraFacets(false);
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

                // ev.preventDefault();
                // ev.stopPropagation();
                // console.log('onKeyDown', ev);

                return inputProps.onKeyDown(ev);
              }}
              onBlur={() => {
                // console.log('blur?');
              }}
            />
          ) : (
            ''
          )}

          <div className="input-controls">
            {(searchTerm || '').trim() && (
              <div className="ui button basic">
                <Icon
                  name="close"
                  role="button"
                  onClick={() => {
                    inputProps.onChange({ target: { value: '' } });
                    setSearchTerm('');
                    // onSubmit();
                  }}
                />
              </div>
            )}

            {/*
            <div
              className={'ui button basic ' + (showExtraFacets ? 'opened' : '')}
            >
              <Icon
                name="sliders"
                role="button"
                onClick={() => {
                  setShowExtraFacets(!showExtraFacets);
                }}
              />
            </div>
            */}

            {/* <MicrophoneInput onChange={onChange} /> */}
          </div>

          {getAutocomplete()}
        </div>
      </div>

      <SampleQueryPrompt />

      {/*showExtraFacets ? (
        <div className="extra-facets">
          {searchPhrases.length > 0 &&
            searchPhrases.find((phrase) => phrase.indexOf(' ') > -1) && (
              <ExactPhrasesFacet />
            )}
          <IncludeArchivedFacet />
        </div>
      ) : null*/}
    </>
  );
}

export default SearchInput;
