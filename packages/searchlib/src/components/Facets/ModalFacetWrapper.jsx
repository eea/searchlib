import React from 'react';
import { withSearch, Facet as SUIFacet } from '@elastic/react-search-ui';
import { Card, Modal, Button } from 'semantic-ui-react'; // , Header, Image
import MultiCheckboxFacet from './MultiCheckboxFacet';
import usePrevious from '@eeacms/search/lib/hocs/usePrevious';
import { isEqual } from 'lodash';

const getFacetTotalCount = (facets, name) => {
  return facets?.[name]?.[0]?.data?.length || 0;
  // return facets?.[name]?.[0]?.data?.reduce((acc, { count }) => acc + count, 0);
};

function reducer(state, action) {
  const { value } = action;
  switch (action.type) {
    case 'set':
      if (state.includes(value)) return;
      return [...state, value];
    case 'remove':
      return [...state].filter((v) => v !== value);
    case 'reset':
      return [...action.value];
    default:
      throw new Error();
  }
}

const OptionsWrapper = (props) => {
  const { options, view, state, dispatch, ...rest } = props;
  const View = view || MultiCheckboxFacet;
  const previousOptions = usePrevious(options);

  React.useEffect(() => {
    if (!isEqual(options, previousOptions)) {
      const newState = options
        .filter(({ selected }) => !!selected)
        .map(({ value }) => value);
      dispatch({
        type: 'reset',
        value: newState,
      });
    }
  }, [state, dispatch, options, previousOptions]);

  const newOptions = options.map(({ value, count, selected }) => ({
    value,
    count,
    selected: state.includes(value) ? true : false,
  }));

  return (
    <View
      {...rest}
      options={newOptions}
      onSelect={(value) => {
        dispatch({ type: 'set', value });
      }}
      onRemove={(value) => {
        dispatch({ type: 'remove', value });
      }}
    />
  );
};

const FacetWrapperComponent = (props) => {
  const {
    filters = [],
    facets = {},
    field,
    label,
    addFilter,
    removeFilter,
    filterType,
  } = props;
  const [isOpened, setIsOpened] = React.useState();
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
    <Modal
      onClose={() => setIsOpened(false)}
      onOpen={() => setIsOpened(true)}
      open={isOpened}
      trigger={
        <Card
          fluid
          header={label}
          className={(isActive && 'facet active') || 'facet'}
          onClick={() => {}}
          meta={getFacetTotalCount(facets, field)}
        />
      }
    >
      <SUIFacet
        {...props}
        active={isOpened}
        view={(innerProps) => (
          <OptionsWrapper
            {...innerProps}
            view={props.view}
            state={state}
            dispatch={dispatch}
          />
        )}
      />
      <Modal.Actions>
        <Button color="black" onClick={() => setIsOpened(false)}>
          Cancel
        </Button>
        <Button
          content="Apply"
          labelPosition="right"
          icon="checkmark"
          onClick={() => {
            setIsOpened(false);
            removeFilter(field, '', filterType);
            if (state.length) {
              state.forEach((v) => {
                addFilter(field, v, filterType);
              });
            }
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
};

const FacetWrapper = withSearch(
  ({ filters, facets, addFilter, removeFilter, setFilter, a11yNotify }) => ({
    filters,
    facets,
    addFilter,
    removeFilter,
    setFilter,
    a11yNotify,
  }),
)(FacetWrapperComponent);

export default FacetWrapper;
