import React from 'react';
import { Icon } from 'semantic-ui-react';
import cx from 'classnames';
import { ToggleSort } from '@eeacms/search/components';
import { useSort } from '@eeacms/search/lib/hocs';
import { Checkbox, Button } from 'semantic-ui-react'; // , Header, Image
import { useAppConfig } from '@eeacms/search/lib/hocs';
import withMultiTypeFilter from '@eeacms/search/components/Facets/lib/withMultiTypeFilter';

function getFilterValueDisplay(filterValue) {
  if (filterValue === undefined || filterValue === null) return '';
  if (filterValue.hasOwnProperty('name')) return filterValue.name;
  return String(filterValue);
}

const FacetOptions = (props) => {
  const { sortedOptions, onSelect, onRemove } = props;
  return (
    <div>
      {sortedOptions.map((option) => {
        const checked = option.selected;
        return (
          <Button
            key={`${getFilterValueDisplay(option.value)}`}
            className="term"
            toggle
            active={checked}
            onClick={() =>
              checked ? onRemove(option.value) : onSelect(option.value)
            }
          >
            <span className="title">{getFilterValueDisplay(option.value)}</span>
            <span className="count">{option.count.toLocaleString('en')}</span>
          </Button>
        );
      })}
      {sortedOptions.length < 1 && <div>No matching options</div>}
    </div>
  );
};

const ViewComponent = (props) => {
  const {
    className,
    label,
    onMoreClick,
    onRemove,
    onSelect,
    options,
    showMore,
    showSearch,
    onSearch,
    searchPlaceholder,
    onChangeFilterType,
    filterType = 'any',
    field,
    HeaderWrapper = 'div',
    ContentWrapper = 'div',
  } = props;
  const { appConfig } = useAppConfig();

  // console.log('props', props);

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

  return (
    <>
      <HeaderWrapper>
        <div className="multitermlist__facet__header">
          <div className="facet-title">
            <h3>{facetConfig?.title || label}</h3>

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

          <Checkbox
            toggle
            label="Match all selected"
            checked={filterType === 'all'}
            onChange={(e, { checked }) => {
              onChangeFilterType(checked ? 'all' : 'any');
            }}
          />

          <ToggleSort
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
          />
        </div>
      </HeaderWrapper>
      <ContentWrapper>
        <FacetOptions
          sortedOptions={sortedOptions}
          label={label}
          onSelect={onSelect}
          onRemove={onRemove}
        />
        <fieldset
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
        </fieldset>
      </ContentWrapper>
    </>
  );
};

export default ViewComponent;
