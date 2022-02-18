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

const OptionsWrapper = (props) => {
  const { options, view, facet, field, ...rest } = props;
  const searchContext = useSearchContext();
  const { registry } = useAppConfig();
  const { filters, facetOptions } = searchContext;
  const View = view;

  // const fieldAtom = filterFamily({ fieldName: field });
  // const [state, dispatch] = useAtom(fieldAtom);
  const [state, dispatch] = useFilterState(field);
  // console.log('Options state', state);

  // this clears the selection state, in case the user cleared the filter from
  // the filter list

  const { tmp_state, has_names } = normalize_state(state);

  let newOptions = has_names
    ? options.map(({ value, count, selected }) => ({
        value,
        count,
        selected: tmp_state.includes(
          typeof value === 'object' ? value.name : value,
        )
          ? true
          : false,
      }))
    : tmp_state;

  const previousOptions = usePrevious(options);
  React.useEffect(() => {
    // console.log({ options, previousOptions });
    if (
      !previousOptions ||
      (previousOptions && !isEqual(options, previousOptions))
    ) {
      const newState = options
        .filter(({ selected }) => !!selected)
        .map(({ value }) => value);
      dispatch({
        type: 'reset',
        value: newState,
      });
    }
  }, [state, dispatch, options, previousOptions]);

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

  // React.useEffect(() => {
  //   return () => {
  //     console.log('unmount OptionsWrapper', field);
  //   };
  // }, [field]);

  return (
    <View
      {...rest}
      {...searchContext}
      HeaderWrapper={Modal.Header}
      ContentWrapper={renderContent}
      options={optionsFilter ? optionsFilter(newOptions, filters) : newOptions}
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
