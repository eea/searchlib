function getValueFacet(aggregations, fieldName) {
  if (
    aggregations &&
    aggregations[fieldName] &&
    aggregations[fieldName].buckets &&
    aggregations[fieldName].buckets.length > 0
  ) {
    return [
      {
        field: fieldName,
        type: 'value',
        data: aggregations[fieldName].buckets.map((bucket) => ({
          // Boolean values and date values require using `key_as_string`
          value: bucket.key_as_string || bucket.key,
          count: bucket.doc_count,
        })),
      },
    ];
  }
}

function getRangeFacet(aggregations, fieldName) {
  if (
    aggregations &&
    aggregations[fieldName] &&
    aggregations[fieldName].buckets &&
    aggregations[fieldName].buckets.length > 0
  ) {
    return [
      {
        field: fieldName,
        type: 'range',
        data: aggregations[fieldName].buckets.map((bucket) => ({
          // Boolean values and date values require using `key_as_string`
          value: {
            to: bucket.to,
            from: bucket.from,
            name: bucket.key,
          },
          count: bucket.doc_count,
        })),
      },
    ];
  }
}

export default function buildStateFacets(aggregations) {
  // const visitors = getRangeFacet(aggregations, 'visitors');

  const Country = getValueFacet(aggregations, 'Country');
  const Sector = getValueFacet(aggregations, 'Sector');
  const Use_or_activity = getValueFacet(aggregations, 'Use_or_activity');
  const Status = getValueFacet(aggregations, 'Status');
  const Origin_of_the_measure = getValueFacet(
    aggregations,
    'Origin_of_the_measure',
  );
  const Nature_of_the_measure = getValueFacet(
    aggregations,
    'Nature_of_the_measure',
  );
  const Water_body_category = getValueFacet(
    aggregations,
    'Water_body_category',
  );
  const Spatial_scope = getValueFacet(aggregations, 'Spatial_scope');
  const Measure_Impacts_to = getValueFacet(aggregations, 'Measure_Impacts_to');
  const Descriptors = getValueFacet(aggregations, 'Descriptors');

  const facets = {
    ...(Country && { Country }),
    ...(Sector && { Sector }),
    ...(Use_or_activity && { Use_or_activity }),
    ...(Status && { Status }),
    ...(Origin_of_the_measure && { Origin_of_the_measure }),
    ...(Nature_of_the_measure && { Nature_of_the_measure }),
    ...(Water_body_category && { Water_body_category }),
    ...(Spatial_scope && { Spatial_scope }),
    ...(Measure_Impacts_to && { Measure_Impacts_to }),
    ...(Descriptors && { Descriptors }),
  };

  if (Object.keys(facets).length > 0) {
    return facets;
  }
}
