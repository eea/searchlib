import React from 'react';
import { Facet as SUIFacet } from '@elastic/react-search-ui';
import { Card, Modal, Button } from 'semantic-ui-react'; // , Header, Image
import { useSearchContext } from '@eeacms/search/lib/hocs';
import usePrevious from '@eeacms/search/lib/hocs/usePrevious';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { isEqual } from 'lodash';

const getFacetTotalCount = (facets, name) => {
  const customFields = ['time_coverage', 'year'];
  if (customFields.includes(name)) {
    return <>&nbsp;</>;
  }

  return facets?.[name]?.[0]?.data?.length || 0;
  // return facets?.[name]?.[0]?.data?.reduce((acc, { count }) => acc + count, 0);
};

function normalize_state(state) {
  let tmp_state = [];
  let has_names = true;
  if (typeof state?.[0] === 'string') {
    tmp_state = state;
  }
  if (typeof state?.[0] === 'object') {
    if (state?.[0]?.name) {
      tmp_state = state.map((st) => st.name);
    } else {
      tmp_state = state;
      has_names = false;
    }
  }
  return { tmp_state, has_names };
}

function reducer(state, action) {
  const { value } = action;
  const { tmp_state, has_names } = normalize_state(state);
  const tmp_value = typeof value === 'object' ? value.name : value;
  switch (action.type) {
    case 'set':
      if (has_names && tmp_state.includes(tmp_value)) {
        return;
      }
      return action.force ? value : [...state, value];
    case 'remove':
      return [...state].filter((v) =>
        typeof v === 'object' ? v.name !== tmp_value : v !== tmp_value,
      );
    case 'reset':
      return [...action.value];
    default:
      throw new Error();
  }
}

const OptionsWrapper = (props) => {
  const { options, view, state, dispatch, ...rest } = props;
  const searchContext = useSearchContext();
  const View = view;
  const previousOptions = usePrevious(options);
  React.useEffect(() => {
    if (previousOptions && !isEqual(options, previousOptions)) {
      const newState = options
        .filter(({ selected }) => !!selected)
        .map(({ value }) => value);
      dispatch({
        type: 'reset',
        value: newState,
      });
    }
  }, [state, dispatch, options, previousOptions]);

  const { tmp_state, has_names } = normalize_state(state);

  let newOptions = [];
  if (has_names) {
    newOptions = options.map(({ value, count, selected }) => ({
      value,
      count,
      selected: tmp_state.includes(
        typeof value === 'object' ? value.name : value,
      )
        ? true
        : false,
    }));
  } else {
    newOptions = tmp_state;
  }
  return (
    <View
      {...rest}
      {...searchContext}
      HeaderWrapper={Modal.Header}
      ContentWrapper={({ children }) => (
        <Modal.Content image>{children}</Modal.Content>
      )}
      options={newOptions}
      onSelect={(value, force) => {
        dispatch({ type: 'set', force, value });
      }}
      onRemove={(value) => {
        dispatch({ type: 'remove', value });
      }}
    />
  );
};

const CLMSFacetWrapperComponent = (props) => {
  const searchContext = useSearchContext();
  const {
    filters = [],
    facets = {},
    addFilter,
    removeFilter,
    // setFilter,
  } = searchContext;
  const { field, label } = props;
  const [isOpened, setIsOpened] = React.useState();

  const { appConfig } = useAppConfig();
  const facet = appConfig.facets?.find((f) => f.field === field);
  // const fallback = facet ? facet.filterType : defaultType;
  const fallback = props.filterType ? props.filterType : facet.filterType;
  const defaultValue = field
    ? filters?.find((f) => f.field === field)?.type || fallback
    : fallback;
  const [localFilterType, setLocalFilterType] = React.useState(defaultValue);

  const initialValue =
    (filters.find((f) => f.field === field) || {})?.values || [];
  const isActive = initialValue.length > 0;

  const [state, dispatch] = React.useReducer(
    reducer,
    !initialValue
      ? []
      : Array.isArray(initialValue)
      ? initialValue
      : [initialValue],
  );
  return (
    // <Modal
    //   className={(isActive && 'facet active') || 'facet'}
    //   onClose={() => setIsOpened(false)}
    //   onOpen={() => setIsOpened(true)}
    //   open={isOpened}
    //   trigger={
    //     <Card
    //       fluid
    //       header={label}
    //       className={(isActive && 'facet active') || 'facet'}
    //       onClick={() => {}}
    //       meta={getFacetTotalCount(facets, field)}
    //     />
    //   }
    // >
      
        <SUIFacet
          {...props}
          // active={isOpened}
          view={(innerProps) => (
            <OptionsWrapper
              {...innerProps}
              filterType={localFilterType}
              onChangeFilterType={(v) => setLocalFilterType(v)}
              view={props.view}
              state={state}
              dispatch={dispatch}
              field={field}
            />
          )}
        />
    //   <Modal.Actions>
    //     <Button
    //       color="black"
    //       onClick={() => {
    //         setIsOpened(false);
    //         dispatch({ type: 'reset', value: initialValue });
    //       }}
    //     >
    //       Cancel
    //     </Button>
    //     <Button
    //       content="Apply"
    //       labelPosition="right"
    //       icon="checkmark"
    //       onClick={() => {
    //         setIsOpened(false);
    //         removeFilter(field, '', 'any');
    //         removeFilter(field, '', 'all');
    //         if (state.length) {
    //           state.forEach((v) => {
    //             addFilter(field, v, localFilterType);
    //           });
    //         }
    //       }}
    //       positive
    //     />
    //   </Modal.Actions>
    // </Modal>
  );
};

export default CLMSFacetWrapperComponent;

// const FacetWrapper = withSearch(
//   ({ filters, facets, addFilter, removeFilter, setFilter, a11yNotify }) => ({
//     filters,
//     facets,
//     addFilter,
//     removeFilter,
//     setFilter,
//     a11yNotify,
//   }),
// )(FacetWrapperComponent);
//
// export default FacetWrapper;
