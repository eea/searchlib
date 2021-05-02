export default function buildStateFacets(aggregations, config) {
  const { facets } = config;
  const facetsMap = Object.assign(
    {},
    ...facets.map((facet) => {
      return { [facet.field]: facet };
    }),
  );

  const result = Object.assign(
    {},
    ...facets.map((facet) => {
      const { getValue } = facetsMap[facet.field];
      const value = getValue(aggregations, facet.field);
      return value ? { [facet.field]: value } : {};
    }),
  );

  // TODO: make this generic
  // const visitors = getRangeFacet(aggregations, 'visitors');
  // const Country = getValueFacet(aggregations, 'Country');
  // const Sector = getValueFacet(aggregations, 'Sector');
  // const Use_or_activity = getValueFacet(aggregations, 'Use_or_activity');
  // const Status = getValueFacet(aggregations, 'Status');
  // const Origin_of_the_measure = getValueFacet(
  //   aggregations,
  //   'Origin_of_the_measure',
  // );
  // const Nature_of_the_measure = getValueFacet(
  //   aggregations,
  //   'Nature_of_the_measure',
  // );
  // const Water_body_category = getValueFacet(
  //   aggregations,
  //   'Water_body_category',
  // );
  // const Spatial_scope = getValueFacet(aggregations, 'Spatial_scope');
  // const Measure_Impacts_to = getValueFacet(aggregations, 'Measure_Impacts_to');
  // const Descriptors = getValueFacet(aggregations, 'Descriptors');
  //
  // const facets_ = {
  //   ...(Country && { Country }),
  //   ...(Sector && { Sector }),
  //   ...(Use_or_activity && { Use_or_activity }),
  //   ...(Status && { Status }),
  //   ...(Origin_of_the_measure && { Origin_of_the_measure }),
  //   ...(Nature_of_the_measure && { Nature_of_the_measure }),
  //   ...(Water_body_category && { Water_body_category }),
  //   ...(Spatial_scope && { Spatial_scope }),
  //   ...(Measure_Impacts_to && { Measure_Impacts_to }),
  //   ...(Descriptors && { Descriptors }),
  // };

  if (Object.keys(result).length > 0) {
    return result;
  }
}
