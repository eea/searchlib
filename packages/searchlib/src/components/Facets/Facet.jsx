/**
 * A replacement for the SUIFacet class that knows that facet fields can be aliased
 * (basically, identify them with facetConfig.id instead of facetConfig.field.
 *
 */

import React from 'react';
import { markSelectedFacetValuesFromFilters } from '@eeacms/search/lib/search/helpers';
import { useSearchContext } from '@eeacms/search/lib/hocs';

export const accentFold = (str = '') =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const FacetContainer = (props) => {
  const [more, setMore] = React.useState(20);
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleClickMore = (totalOptions) => {
    let visibleOptionsCount = more + 10;
    const showingAll = visibleOptionsCount >= totalOptions;
    if (showingAll) visibleOptionsCount = totalOptions;

    setMore(visibleOptionsCount);
  };

  // console.log('myprops', props);

  const {
    className,
    id,
    field,
    filterType = 'all',
    label,
    view,
    isFilterable = false,
    ...rest
  } = props;
  const searchContext = useSearchContext();

  const { filters, facets, addFilter, removeFilter, setFilter } = searchContext;

  const facetsForField = facets[field];

  if (!facetsForField) return null;

  // By using `[0]`, we are currently assuming only 1 facet per field. This
  // will likely be enforced in future version, so instead of an array, there
  // will only be one facet allowed per field.
  const facet = facetsForField[0];

  let facetValues = markSelectedFacetValuesFromFilters(
    facet,
    filters,
    field,
    filterType,
  ).data;

  // console.log({ facet, facetValues, filters, field, filterType });

  const selectedValues = facetValues
    .filter((fv) => fv.selected)
    .map((fv) => fv.value);

  if (!facetValues.length && !selectedValues.length) return null;

  if (searchTerm.trim()) {
    facetValues = facetValues.filter((option) =>
      accentFold(option.value)
        .toLowerCase()
        .includes(accentFold(searchTerm).toLowerCase()),
    );
  }

  const View = view; //  || MultiCheckboxFacet

  return (
    <View
      className={className}
      label={label}
      onMoreClick={handleClickMore}
      onRemove={(value) => {
        removeFilter(field, value, filterType);
      }}
      onChange={(value) => {
        setFilter(field, value, filterType);
      }}
      onSelect={(value) => {
        addFilter(field, value, filterType);
      }}
      options={facetValues.slice(0, more)}
      showMore={facetValues.length > more}
      values={selectedValues}
      showSearch={isFilterable}
      onSearch={(v) => setSearchTerm(v)}
      searchPlaceholder={`Filter ${field}`}
      {...rest}
    />
  );
};

export default FacetContainer;