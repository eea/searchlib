export const buildTermFacetAggregationRequest = (facet) => {
  return {
    [facet.field]: {
      terms: { field: facet.field, size: 1000000 },
    },
  };
};

export const buildHistogramFacetAggregationRequest = (facet) => {
  const qs = {
    range: { field: facet.field },
  };
  if (facet.aggs_script) {
    delete qs.range.field;
    qs.range.script = facet.aggs_script; // allow facet.aggs_script
  }

  if (facet.ranges) {
    qs.range.ranges = facet.ranges;
  }
  // qs.range.ranges =
  console.log('hbf', qs);

  return {
    [facet.field]: qs,
  };

  // See
  // https://github.com/eea/eea.searchserver.js/blob/e3ba7c61cb8d23125b9d9ef240f0b9def790fae6/lib/framework/public/facetview/jquery.facetview.js#L7678-L7691
};
