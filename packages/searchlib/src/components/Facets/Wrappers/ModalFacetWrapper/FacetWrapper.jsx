import React from 'react';
import { Facet } from '@eeacms/search/components';
import { Card, Modal, Button, Icon } from 'semantic-ui-react'; // , Header, Image
import { useSearchContext, useAppConfig } from '@eeacms/search/lib/hocs';

import Filter from '@eeacms/search/components/FilterList/Filter';
import OptionsWrapper from './OptionsWrapper';
import { useFilterState } from './state';

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

  const [state, dispatch] = useFilterState(
    field,
    !initialValue
      ? []
      : Array.isArray(initialValue)
      ? initialValue
      : [initialValue],
  );

  const { clearFilters, setFilter } = useSearchContext();

  const OptionsView = props.view;

  const BoundOptionsWrapper = React.useCallback(
    (innerProps) => {
      return (
        <OptionsWrapper
          {...innerProps}
          field={field}
          facet={facet}
          filterType={localFilterType}
          onChangeFilterType={(v) => setLocalFilterType(v)}
          view={OptionsView}
          filterExact={isExact}
          onChangeFilterExact={(v) => setIsExact(v)}
        />
      );
    },
    [OptionsView, facet, field, isExact, localFilterType],
  );

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
                      if (Array.isArray(state)) {
                        (state || []).forEach((v) => {
                          dispatch({
                            type: 'reset',
                            value: [],
                            id: 'btn-clear-filters',
                          });
                          removeFilter(
                            field,
                            v,
                            `${localFilterType}${isExact ? ':exact' : ''}`,
                          );
                        });
                      } else {
                        dispatch({
                          type: 'reset',
                          value: [],
                          id: 'btn-clear-filters',
                        });
                        removeFilter(
                          field,
                          [state || ''],
                          `${localFilterType}${isExact ? ':exact' : ''}`,
                        );
                      }
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
                    removeFilter={(field, value, type) => {
                      // console.log('remove', { field, value, type });
                      // TODO: add dispatch call here, can remove useEffect
                      // from OptionsWrapper
                      dispatch({ type: 'remove', value });
                      removeFilter(field, value, type);
                    }}
                    onClear={(field) => {
                      const activeFilters = filters.map(({ field }) => field);
                      const exclude = activeFilters.filter(
                        (name) => name !== field,
                      );
                      clearFilters(exclude);
                      // dispatch({ type: 'remove', exclude });
                      dispatch({
                        type: 'reset',
                        value: [],
                        id: 'filter-onClear',
                      });
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
      <Facet
        {...props}
        active={isOpened}
        view={BoundOptionsWrapper}
        state={state}
      />
      <Modal.Actions>
        <Button
          color="black"
          onClick={() => {
            setIsOpened(false);
            dispatch({ type: 'reset', value: initialValue, id: 'btn-cancel' });
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
            removeFilter(field, '', '');
            removeFilter(field, '', 'any');
            removeFilter(field, '', 'all');
            removeFilter(field, '', 'any:exact');
            removeFilter(field, '', 'all:exact');
            // console.log('state', state);
            if (Array.isArray(state)) {
              (state || []).forEach((v) => {
                addFilter(
                  field,
                  v,
                  `${localFilterType}${isExact ? ':exact' : ''}`,
                );
              });
            } else {
              addFilter(
                field,
                [state || ''],
                `${localFilterType}${isExact ? ':exact' : ''}`,
              );
            }
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
                dispatch({ type: 'reset', value: [], id: 'btn-clear-filters' });
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
