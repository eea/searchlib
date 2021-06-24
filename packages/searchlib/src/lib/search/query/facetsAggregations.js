export const buildTermFacetAggregationRequest = (facet) => {
  return {
    [facet.field]: {
      terms: { field: facet.field, size: 1000000 },
    },
  };
};
