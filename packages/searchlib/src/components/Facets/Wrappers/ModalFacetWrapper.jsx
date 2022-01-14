import React from 'react';
import { Facet as SUIFacet } from '@elastic/react-search-ui';
import { Card, Modal, Button, Icon } from 'semantic-ui-react'; // , Header, Image
import { useSearchContext } from '@eeacms/search/lib/hocs';
import usePrevious from '@eeacms/search/lib/hocs/usePrevious';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { isEqual } from 'lodash';
import Filter from './../../FilterList/Filter';

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

  const renderContent = React.useCallback(({ children }) => {
    return (
      <Modal.Content image scrolling>
        {children}
      </Modal.Content>
    );
  }, []);

  return (
    <View
      {...rest}
      {...searchContext}
      HeaderWrapper={Modal.Header}
      ContentWrapper={renderContent}
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

const FacetWrapperComponent = (props) => {
  const searchContext = useSearchContext();
  const { filters = [], addFilter, removeFilter } = searchContext;
  const { field, label } = props;
  const [isOpened, setIsOpened] = React.useState();

  const { appConfig } = useAppConfig();
  const facet = appConfig.facets?.find((f) => f.field === field);
  // const fallback = facet ? facet.filterType : defaultType;

  const fallback = props.filterType ? props.filterType : facet.filterType;

  const defaultValue = field
    ? filters?.find((f) => f.field === field)?.type || fallback
    : fallback;

  const [defaultTypeValue, defaultIsExact] = (defaultValue || '').split(':');

  const [localFilterType, setLocalFilterType] = React.useState(
    defaultTypeValue,
  );

  const [isExact, setIsExact] = React.useState(defaultIsExact);

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

  const { clearFilters, setFilter } = useSearchContext();

  return (
    <Modal
      className={(isActive && 'facet active') || 'facet'}
      onClose={() => setIsOpened(false)}
      onOpen={() => setIsOpened(true)}
      open={isOpened}
      trigger={
        <Card
          fluid
          header={
            <div className="header">
              <span className="text" title={label}>
                {label}
              </span>
              {state.length > 1 ? (
                <span className="clear-filters">
                  <Button
                    size="mini"
                    onClick={(evt) => {
                      evt.preventDefault();
                      setIsOpened(false);
                      (state || []).forEach((v) => {
                        removeFilter(
                          field,
                          v,
                          `${localFilterType}${isExact ? ':exact' : ''}`,
                        );
                      });
                    }}
                  >
                    Clear
                  </Button>
                </span>
              ) : null}
            </div>
          }
          description={
            <div className="filter description">
              {filters.map((filter, index) => {
                return filter.field === field ? (
                  <Filter
                    key={index}
                    {...filter}
                    noTitle={true}
                    setFilter={setFilter}
                    removeFilter={removeFilter}
                    onClear={(field) => {
                      const activeFilters = filters.map(({ field }) => field);
                      const exclude = activeFilters.filter(
                        (name) => name !== field,
                      );
                      clearFilters(exclude);
                    }}
                  />
                ) : null;
              })}
            </div>
          }
          className={(isActive && 'facet active') || 'facet'}
          onClick={() => {}}
        />
      }
    >
      <SUIFacet
        {...props}
        active={isOpened}
        view={(innerProps) => (
          <OptionsWrapper
            {...innerProps}
            filterType={localFilterType}
            filterExact={isExact}
            onChangeFilterType={(v) => setLocalFilterType(v)}
            onChangeFilterExact={(v) => setIsExact(v)}
            view={props.view}
            state={state}
            dispatch={dispatch}
          />
        )}
      />
      <Modal.Actions>
        <Button
          color="black"
          onClick={() => {
            setIsOpened(false);
            dispatch({ type: 'reset', value: initialValue });
          }}
        >
          Cancel
        </Button>
        <Button
          content="Apply"
          labelPosition="right"
          icon="checkmark"
          onClick={() => {
            setIsOpened(false);
            removeFilter(field, '', 'any');
            removeFilter(field, '', 'all');
            removeFilter(field, '', 'any:exact');
            removeFilter(field, '', 'all:exact');
            (state || []).forEach((v) => {
              addFilter(
                field,
                v,
                `${localFilterType}${isExact ? ':exact' : ''}`,
              );
            });
          }}
          positive
        />
        {state.length > 1 ? (
          <a
            href="/"
            className="clear-filters"
            onClick={(evt) => {
              evt.preventDefault();
              if (state.length) {
                dispatch({ type: 'reset', value: [] });
              }
            }}
          >
            <Icon name="delete" />
            Clear
          </a>
        ) : null}
      </Modal.Actions>
    </Modal>
  );
};

export default FacetWrapperComponent;
