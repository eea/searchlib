import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import cx from 'classnames';
import { SearchInput } from '@eeacms/search/components/SearchInput/SearchInput';
// import { CLMSSearchInput } from './SearchInput/CLMSSearchInput';
import { useAppConfig } from '@eeacms/search/lib/hocs/appConfig';

import { Result, Autocomplete } from '@elastic/react-search-ui-views';

function CLMSSearchBoxView(props) {
  const { appConfig } = useAppConfig();
  const {
    className,
    allAutocompletedItemsCount,
    autocompleteView,
    isFocused,
    inputProps = {},
    inputView,
    onChange,
    onSelectAutocomplete,
    onSubmit,
    useAutocomplete,
    value,
    // NOTE: These are explicitly de-structured but not used so that they are
    // not passed through to the input with the 'rest' parameter
    // eslint-disable-next-line no-unused-vars
    autocompletedResults,
    // eslint-disable-next-line no-unused-vars
    autocompletedSuggestions,
    // eslint-disable-next-line no-unused-vars
    autocompletedSuggestionsCount,
    // eslint-disable-next-line no-unused-vars
    completeSuggestion,
    // eslint-disable-next-line no-unused-vars
    notifyAutocompleteSelected,
    mode,
    ...rest
  } = props;
  const focusedClass = isFocused ? 'focus' : '';
  const AutocompleteView = autocompleteView || Autocomplete;
  const InputView = inputView || SearchInput;

  return (
    <Downshift
      inputValue={value}
      onChange={onSelectAutocomplete}
      onInputValueChange={(newValue) => {
        // To avoid over dispatching
        if (value === newValue) return;
        onChange(newValue);
      }}
      // Because when a selection is made, we don't really want to change
      // the inputValue. This is supposed to be a "controlled" value, and when
      // this happens we lose control of it.
      itemToString={() => value}
      {...rest}
    >
      {(downshiftProps) => {
        const { closeMenu, getInputProps, isOpen } = downshiftProps;
        let autocompleteClass = isOpen === true ? ' autocomplete' : '';
        return (
          <div>
            {appConfig.subheadline ? (
              <div class="page-description">{appConfig.subheadline}</div>
            ) : (
              ''
            )}
            <form
              class="ccl-form search-form"
              onSubmit={(e) => {
                closeMenu();
                onSubmit(e);
              }}
            >
              {/* <input
                type="text"
                class="ccl-text-input"
                id="datasets_search"
                name=""
                placeholder="Search datasets"
                aria-label="Search datasets"
              /> */}
              <InputView
                id="datasets_search"
                mode={mode}
                onSubmit={onSubmit}
                onChange={(newValue) => {
                  // To avoid over dispatching
                  if (value === newValue) return;
                  onChange(newValue);
                }}
                {...downshiftProps}
                getInputProps={(additionalProps) => {
                  const { className, ...rest } = additionalProps || {};
                  return getInputProps({
                    placeholder: 'Search',
                    ...inputProps,
                    className: cx(
                      'sui-search-box__text-input',
                      inputProps.className,
                      className,
                      focusedClass,
                    ),
                    ...rest,
                  });
                }}
                getButtonProps={(additionalProps) => {
                  const { className, ...rest } = additionalProps || {};
                  return {
                    type: 'submit',
                    value: 'Search',
                    className: cx('button sui-search-box__submit', className),
                    ...rest,
                  };
                }}
                getAutocomplete={() => {
                  if (
                    useAutocomplete &&
                    isOpen &&
                    allAutocompletedItemsCount > 0
                  ) {
                    return <AutocompleteView {...props} {...downshiftProps} />;
                  } else {
                    return null;
                  }
                }}
              />
              <button class="ccl-button" type="submit" aria-label="Search">
                <span class="ccl-icon-zoom"></span>
              </button>
            </form>
            {/* <form
              onSubmit={(e) => {
                closeMenu();
                onSubmit(e);
              }}
            >
                {appConfig.title ? (
                  <h2 className="searchApp-headline">{appConfig.title}</h2>
                ) : (
                  ''
                )} 
              <div
                className={cx('sui-search-box', className, autocompleteClass)}
              >
                <InputView
                  mode={mode}
                  onSubmit={onSubmit}
                  onChange={(newValue) => {
                    // To avoid over dispatching
                    if (value === newValue) return;
                    onChange(newValue);
                  }}
                  {...downshiftProps}
                  getInputProps={(additionalProps) => {
                    const { className, ...rest } = additionalProps || {};
                    return getInputProps({
                      placeholder: 'Search',
                      ...inputProps,
                      className: cx(
                        'sui-search-box__text-input',
                        inputProps.className,
                        className,
                        focusedClass,
                      ),
                      ...rest,
                    });
                  }}
                  getButtonProps={(additionalProps) => {
                    const { className, ...rest } = additionalProps || {};
                    return {
                      type: 'submit',
                      value: 'Search',
                      className: cx('button sui-search-box__submit', className),
                      ...rest,
                    };
                  }}
                  getAutocomplete={() => {
                    if (
                      useAutocomplete &&
                      isOpen &&
                      allAutocompletedItemsCount > 0
                    ) {
                      return (
                        <AutocompleteView {...props} {...downshiftProps} />
                      );
                    } else {
                      return null;
                    }
                  }}
                />
              </div>
            </form> */}
          </div>
        );
      }}
    </Downshift>
  );
}

CLMSSearchBoxView.propTypes = {
  // Provided by container
  allAutocompletedItemsCount: PropTypes.number.isRequired,
  autocompletedResults: PropTypes.arrayOf(Result).isRequired,
  // autocompletedSuggestions: PropTypes.objectOf(PropTypes.arrayOf(Suggestion))
  //   .isRequired,
  autocompletedSuggestionsCount: PropTypes.number.isRequired,
  completeSuggestion: PropTypes.func.isRequired,
  notifyAutocompleteSelected: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  autocompleteResults: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      titleField: PropTypes.string.isRequired,
      urlField: PropTypes.string.isRequired,
      linkTarget: PropTypes.string,
      sectionTitle: PropTypes.string,
    }),
  ]),
  autocompleteView: PropTypes.func,
  autocompleteSuggestions: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.exact({
      sectionTitle: PropTypes.string,
    }),
    PropTypes.objectOf(
      PropTypes.exact({
        sectionTitle: PropTypes.string,
      }),
    ),
  ]),
  className: PropTypes.string,
  inputProps: PropTypes.object,
  inputView: PropTypes.func,
  isFocused: PropTypes.bool,
  useAutocomplete: PropTypes.bool,

  // Specific configuration for this view only
  onSelectAutocomplete: PropTypes.func,
};

export default CLMSSearchBoxView;
