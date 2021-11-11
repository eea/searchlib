import React from 'react';
import { Icon } from 'semantic-ui-react';
import cx from 'classnames';
import { ToggleSort } from '@eeacms/search/components';
import { useSort } from '@eeacms/search/lib/hocs';
import { Checkbox, Button } from 'semantic-ui-react'; // , Header, Image
import { useAppConfig } from '@eeacms/search/lib/hocs';
// import withMultiTypeFilter from '@eeacms/search/components/Facets/lib/withMultiTypeFilter';

function getFilterValueDisplay(filterValue) {
  if (filterValue === undefined || filterValue === null) return '';
  if (filterValue.hasOwnProperty('name')) return filterValue.name;
  return String(filterValue);
}

const FacetOptions = (props) => {
  const {
    sortedOptions,
    groupedOptionsByLetters,
    groupedOptionsByNumbers,
    sorting,
    onSelect,
    onRemove,
    label,
  } = props;
  const { appConfig } = useAppConfig();

  const clusterIcons = appConfig.contentUtilsParams.clusterIcons;
  const getClusterIcon = (title) => {
    return clusterIcons[title]?.icon || clusterIcons.fallback.icon;
  };

  let isGroupedByLetters = false;
  if (Object.keys(groupedOptionsByLetters).length > 0) {
    if (
      groupedOptionsByLetters.letters.length >= 5 &&
      sortedOptions.length >= 100
    ) {
      // Apply grouping by letters only if we have at least 5 groups and
      // at least 100 options.
      isGroupedByLetters = true;
    }
  }

  let isGroupedByNumbers = false;
  if (Object.keys(groupedOptionsByNumbers).length > 0) {
    if (
      groupedOptionsByNumbers.numbers.length >= 3 &&
      sortedOptions.length >= 50
    ) {
      // Apply grouping by numbers only if we have at least 5 groups and
      // at least 50 options.
      isGroupedByNumbers = true;
    }
  }

  return (
    <div>
      {isGroupedByLetters && (
        <>
          {groupedOptionsByLetters.letters.map((letter, index) => {
            return (
              <div className="by-groups" key={letter}>
                <div
                  className={`group-heading ${index === 0 ? 'first' : ''}`}
                  key={letter + 'h'}
                >
                  <span>{letter}</span>
                </div>
                <div className="group-content" key={letter + 'c'}>
                  {groupedOptionsByLetters[letter].map((option) => {
                    const checked = option.selected;
                    return (
                      <Button
                        key={`${getFilterValueDisplay(option.value)}`}
                        className="term"
                        toggle
                        active={checked}
                        onClick={() =>
                          checked
                            ? onRemove(option.value)
                            : onSelect(option.value)
                        }
                      >
                        {label === 'Content types' ? (
                          <Icon name={getClusterIcon(option.value)} />
                        ) : null}
                        <span className="title">
                          {getFilterValueDisplay(option.value)}
                        </span>
                        <span className="count">
                          {option.count.toLocaleString('en')}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}

      {isGroupedByNumbers && (
        <>
          {groupedOptionsByNumbers.numbers.map((number, index) => {
            let label = '';
            let nextLimit = 0;
            if (sorting.sortOrder === 'descending') {
              if (index === 0) {
                label = `More than ${number}`;
              } else {
                nextLimit = groupedOptionsByNumbers.numbers[index - 1];
                label = `${number}...${nextLimit}`;
              }
            } else {
              nextLimit = groupedOptionsByNumbers.numbers[index + 1];
              if (nextLimit === undefined) {
                label = `More than ${number}`;
              } else {
                label = `${number}...${nextLimit}`;
              }
            }
            return (
              <div className="by-groups" key={number}>
                <div
                  className={`group-heading ${index === 0 ? 'first' : ''}`}
                  key={number + 'h'}
                >
                  <span>{label}</span>
                </div>
                <div className="group-content" key={number + 'c'}>
                  {groupedOptionsByNumbers[number].map((option) => {
                    const checked = option.selected;
                    return (
                      <Button
                        key={`${getFilterValueDisplay(option.value)}`}
                        className="term"
                        toggle
                        active={checked}
                        onClick={() =>
                          checked
                            ? onRemove(option.value)
                            : onSelect(option.value)
                        }
                      >
                        {label === 'Content types' ? (
                          <Icon name={getClusterIcon(option.value)} />
                        ) : null}
                        <span className="title">
                          {getFilterValueDisplay(option.value)}
                        </span>
                        <span className="count">
                          {option.count.toLocaleString('en')}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}

      {!(isGroupedByLetters || isGroupedByNumbers) &&
        sortedOptions.map((option) => {
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
              {label === 'Content types' ? (
                <Icon name={getClusterIcon(option.value)} />
              ) : null}
              <span className="title">
                {getFilterValueDisplay(option.value)}
              </span>
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
      defaultSortOrder: {
        // each criteria has its own default sort order
        count: 'descending',
        value: 'ascending',
      },
    },
  );

  const facetConfig = appConfig.facets.find((f) => f.field === field);

  const byLetters = {};
  if (sorting.sortOn === 'value') {
    byLetters.letters = [];
    sortedOptions.forEach((item) => {
      const firstLetter = item.value[0];
      if (!byLetters.letters.includes(firstLetter)) {
        byLetters.letters.push(firstLetter);
        byLetters[firstLetter] = [];
      }
      byLetters[firstLetter].push(item);
    });
  }

  const numbersLimits = [1000, 500, 100, 50, 10, 1];
  const byNumbers = {};
  if (sorting.sortOn === 'count') {
    byNumbers.numbers = [];
    sortedOptions.forEach((item) => {
      const count = item.count;
      for (const number of numbersLimits) {
        if (count >= number) {
          if (!byNumbers.numbers.includes(number)) {
            byNumbers.numbers.push(number);
            byNumbers[number] = [];
          }
          byNumbers[number].push(item);
          break;
        }
      }
    });
  }

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

          <div className="order-controls">
            <span className="label">Order:</span>
            <ToggleSort
              label="By Count"
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

            <ToggleSort
              label="Alphabetical"
              onToggle={() => toggleSort('value')}
              on={sorting.sortOn === 'value'}
              icon={
                sorting.sortOrder === 'ascending' ? (
                  <Icon name="sort alphabet ascending" />
                ) : (
                  <Icon name="sort alphabet descending" />
                )
              }
            />
          </div>
        </div>
      </HeaderWrapper>
      <ContentWrapper>
        <FacetOptions
          sortedOptions={sortedOptions}
          groupedOptionsByLetters={byLetters}
          groupedOptionsByNumbers={byNumbers}
          sorting={sorting}
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
