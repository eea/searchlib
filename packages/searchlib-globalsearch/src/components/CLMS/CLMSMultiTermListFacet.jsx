import React from 'react';
import { Icon } from 'semantic-ui-react';
import cx from 'classnames';
import { ToggleSort } from '@eeacms/search/components';
import { useSort } from '@eeacms/search/lib/hocs';
import { Checkbox, Button } from 'semantic-ui-react'; // , Header, Image
import { useAppConfig } from '@eeacms/search/lib/hocs';
import withMultiTypeFilter from '@eeacms/search/components/Facets/lib/withMultiTypeFilter';
import { useSearchContext } from '@eeacms/search/lib/hocs';

function getFilterValueDisplay(filterValue) {
  if (filterValue === undefined || filterValue === null) return '';
  if (filterValue.hasOwnProperty('name')) return filterValue.name;
  return String(filterValue);
}

const FacetOptions = (props) => {
  const { sortedOptions, onSelect, onRemove, field, fallback } = props;
  const searchContext = useSearchContext();
  const {
    filters = [],
    facets = {},
    addFilter,
    removeFilter,
    // setFilter,
  } = searchContext;

  const { appConfig } = useAppConfig();
  const facet = appConfig.facets?.find((f) => f.field === field);
  // const fallback = facet ? facet.filterType : defaultType;
  // const fallback = props.filterType ? props.filterType : facet.filterType;
  const defaultValue = field
    ? filters?.find((f) => f.field === field)?.type || fallback
    : fallback;
  const [localFilterType, setLocalFilterType] = React.useState(defaultValue);

  // const initialValue =
  //   (filters.find((f) => f.field === field) || {})?.values || [];
  // const isActive = initialValue.length > 0;

  // const [state, dispatch] = React.useReducer(
  //   reducer,
  //   !initialValue
  //     ? []
  //     : Array.isArray(initialValue)
  //     ? initialValue
  //     : [initialValue],
  // );
  // console.log('props: ', props);
  return (
    <div>
      {sortedOptions.map((option) => {
        const checked = option.selected;
        return (
          <>
            <div class="ccl-form-group">
              <input
                type="checkbox"
                id={field + '_' + option.value + '_filter'}
                name="field_gdpr[value]"
                value={option.value}
                className="ccl-checkbox ccl-required ccl-form-check-input"
                data-enpassusermodified="yes"
                checked={checked}
                onChange={() => {
                  if (checked) {
                    removeFilter(field, option.value, localFilterType);
                  } else {
                    // removeFilter(field, '', 'any');
                    // removeFilter(field, '', 'all');
                    addFilter(field, option.value, localFilterType);
                  }
                }}
              />
              <label className="ccl-form-check-label" for={field + '_' + option.value + '_filter'}>
                {option.value}
              </label>
            </div>
            {/* <Button
              key={`${getFilterValueDisplay(option.value)}`}
              className="term"
              toggle
              active={checked}
              onClick={() =>
                checked ? onRemove(option.value) : onSelect(option.value)
              }
            >
              <span className="title">
                {getFilterValueDisplay(option.value)}
              </span>
              <span className="count">{option.count.toLocaleString('en')}</span>
            </Button> */}
          </>
        );
      })}
      {sortedOptions.length < 1 && <div>No matching options</div>}
    </div>
  );
};

const CLMSMultiTermListFacet = (props) => {
  const {
    // className,
    label,
    // onMoreClick,
    onRemove,
    onSelect,
    options,
    // showMore,
    showSearch,
    onSearch,
    searchPlaceholder,
    // onChangeFilterType,
    // filterType = 'any',
    field,
    // HeaderWrapper = 'div',
    // ContentWrapper = 'div',
  } = props;
  const { appConfig } = useAppConfig();

  // const sortedOptions = sorted(options, sortOn, sortOrder);

  const { sortedValues: sortedOptions, toggleSort, sorting } = useSort(
    options,
    ['value', 'count'],
    {
      defaultSortOn: 'count',
      defaultSortOrder: 'descending',
    },
  );
  const facetConfig = appConfig.facets.find((f) => f.field === field);
  let initialIsOpened = false;
  sortedOptions.forEach((option) => {
    if (option.selected) {
      initialIsOpened = true;
    }
  });
  const [isOpened, setIsOpened] = React.useState(initialIsOpened);

  return (
    <>
      <fieldset className="ccl-fieldset">
        <div
          className="ccl-expandable__button"
          aria-expanded={isOpened}
          onClick={() => setIsOpened(!isOpened)}
          onKeyDown={() => setIsOpened(!isOpened)}
          tabIndex="0"
          role="button">
          <legend class="ccl-form-legend">{facetConfig?.title || label}</legend>
          <div className="multitermlist__facet__header">
            <div className="facet-title">
              {showSearch && (
                <div className="search">
                  <Icon name="search" size="small" color="blue" />
                  <input
                    className="multitermlist__search__text-input"
                    type="search"
                    placeholder={searchPlaceholder || 'Search'}
                    onChange={(e) => {
                      onSearch(e.target.value);
                    }}
                  />
                </div>
              )}
            </div>

            {/* <Checkbox
            toggle
            label="Match all selected"
            checked={filterType === 'all'}
            onChange={(e, { checked }) => {
              onChangeFilterType(checked ? 'all' : 'any');
            }}
          /> */}

            {/* <ToggleSort
            label="Count"
            onToggle={() => toggleSort('count')}
            on={sorting.sortOn === 'count'}
            icon={
              sorting.sortOrder === 'ascending' ? (
                <Icon name="sort numeric ascending" />
              ) : (
                <Icon name="sort numeric descending" />
              )
            }
          /> */}
          </div>
        </div>
        <div class="ccl-form">
          <FacetOptions
            sortedOptions={sortedOptions}
            label={label}
            onSelect={onSelect}
            onRemove={onRemove}
            field={field}
          />
        </div>
        {/* <fieldset
          className={cx('sui-facet searchlib-multiterm-facet', className)}
        >
          {showMore && (
            <button
              type="button"
              className="sui-facet-view-more"
              onClick={onMoreClick}
              aria-label="Show more options"
            >
              + More
            </button>
          )}
        </fieldset> */}
      </fieldset>
    </>
  );
};

export default CLMSMultiTermListFacet;
