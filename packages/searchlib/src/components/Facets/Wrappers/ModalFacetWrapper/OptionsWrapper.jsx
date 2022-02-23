import React from 'react';
import { isEqual } from 'lodash';
import { Modal } from 'semantic-ui-react'; // , Header, Image
import { useFilterState } from './state';

import {
  usePrevious,
  useSearchContext,
  useAppConfig,
} from '@eeacms/search/lib/hocs';
import { normalize_state } from './state';

const getOptions = (state, options) => {
  const { tmp_state, has_names } = normalize_state(state);

  let newOptions = has_names
    ? options.map(({ value, count, selected }) => ({
        value,
        count,
        // TODO: also handle histogram facet
        selected: tmp_state.includes(
          typeof value === 'object' ? value.name : value,
        )
          ? true
          : false,
      }))
    : tmp_state;
  return newOptions;
};

const OptionsWrapper = (props) => {
  const { options, view, facet, field, ...rest } = props;
  const searchContext = useSearchContext();
  const { registry } = useAppConfig();
  const { filters, facetOptions } = searchContext;
  const View = view;

  const [state, dispatch] = useFilterState(field);

  // this clears the selection state, in case the user cleared the filter from
  // the filter list

  const derivedOptions = getOptions(state, options);
  const previousOptions = usePrevious(options);

  // React.useEffect(() => {
  //   if (
  //     !previousOptions ||
  //     (previousOptions && !isEqual(options, previousOptions))
  //   ) {
  //     if (state?.[0]?.to ?? null) {
  //       // don't reset histogram facet;
  //       // TODO: this is the coward option; proper thing would be to do the
  //       // reset here. It works out because the histogram facet reads its value
  //       // directly from the filters list
  //       // const newOptions = getOptions(state, options);
  //       // console.log('reset', {
  //       //   previousOptions,
  //       //   options,
  //       //   newOptions,
  //       //   newState,
  //       //   state,
  //       // });
  //       return;
  //     }
  //     const newState = options
  //       .filter(({ selected }) => !!selected)
  //       .map(({ value }) => value);
  //     dispatch({
  //       type: 'reset',
  //       value: newState,
  //       id: `${field}/options-wrapper`,
  //     });
  //   }
  // }, [state, dispatch, options, previousOptions, field]);

  const renderContent = React.useCallback(({ children }) => {
    return (
      <Modal.Content image scrolling>
        {children}
      </Modal.Content>
    );
  }, []);

  const optionsFilter = facet.optionsFilter
    ? registry.resolve[facet.optionsFilter]
    : null;

  return (
    <View
      {...rest}
      {...searchContext}
      HeaderWrapper={Modal.Header}
      ContentWrapper={renderContent}
      options={
        optionsFilter ? optionsFilter(derivedOptions, filters) : derivedOptions
      }
      availableOptions={facetOptions[field]}
      onSelect={(value, force) => {
        dispatch({ type: 'set', force, value });
      }}
      onRemove={(value) => {
        dispatch({ type: 'remove', value });
      }}
    />
  );
};

export default OptionsWrapper;
