import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import cx from 'classnames';
import { Grid } from 'semantic-ui-react';

import { Result, Autocomplete } from '@elastic/react-search-ui-views';

import { useAppConfig, useSearchContext } from '@eeacms/search/lib/hocs';

import Loader from '../Loaders';
import SearchInput from '../SearchInput/SearchInput';
import searchLogo from './search-logo.png';

function SearchBoxView(props) {
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
  const { isLoading } = useSearchContext();

  // TODO: this shouldn't be done via react router
  const homeURL = '//' + window.location.host + window.location.pathname;

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
          <div className="header-content">
            <Grid columns={2} container stackable className="header-columns">
              <Grid.Row>
                <Grid.Column widescreen="2" tablet="2" className="col-left">
                  {isLoading ? (
                    <Loader
                      type="Watch"
                      visible={true}
                      secondaryColor="red"
                      color="#CCC"
                    />
                  ) : (
                    <div className="search-logo">
                      <a href={homeURL}>
                        <img src={searchLogo} alt="logo" />
                      </a>
                    </div>
                  )}
                </Grid.Column>
                <Grid.Column widescreen="8" tablet="8" className="col-mid">
                  <form
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
                    {appConfig.subheadline ? (
                      <h3 className="searchApp-subheadline">
                        {appConfig.subheadline}
                      </h3>
                    ) : (
                      ''
                    )}
                    <div
                      className={cx(
                        'sui-search-box',
                        className,
                        autocompleteClass,
                      )}
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
                            placeholder:
                              'Type in keywords or just ask a question',
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
                            className: cx(
                              'button sui-search-box__submit',
                              className,
                            ),
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
                              <AutocompleteView
                                {...props}
                                {...downshiftProps}
                              />
                            );
                          } else {
                            return null;
                          }
                        }}
                      />
                    </div>
                  </form>
                </Grid.Column>
                <Grid.Column
                  widescreen="2"
                  tablet="2"
                  className="col-left"
                ></Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        );
      }}
    </Downshift>
  );
}

SearchBoxView.propTypes = {
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

export default SearchBoxView;
