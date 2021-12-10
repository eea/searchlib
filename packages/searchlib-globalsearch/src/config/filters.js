import { getTodayWithTime } from '../utils';

export default {
  // filter values that are always added to the ES requests
  permanentFilters: [
    { term: { hasWorkflowState: 'published' } },
    () => ({
      constant_score: {
        filter: {
          bool: {
            should: [
              { bool: { must_not: { exists: { field: 'issued' } } } },
              // TODO: this needs to be made a dynamic function
              { range: { 'issued.date': { lte: getTodayWithTime() } } },
            ],
          },
        },
      },
    }),
  ],

  // default filter values
  // TODO: this needs to be removed and the configuration plugged into each of
  // the facets
  defaultFilterValues: {
    // language: {
    //   value: 'en',
    //   type: 'any',
    // },
    // readingTime: {
    //   value: { name: 'All', rangeType: 'fixed' },
    //   type: 'any',
    // },
  },
};

//  || boolFilters.length
// const boolFilters = (config.facets || []).reduce(
//   (acc, facet) =>
//     filters.find((filter) => filter.field === facet.field)
//       ? [
//           ...acc,
//           {
//             field: facet.field,
//             values: [true],
//           },
//         ]
//       : [
//           ...acc,
//           {
//             field: facet.field,
//             values: [false],
//           },
//         ],
//   [],
// );

// ...(Object.keys(_fieldToFilterValueMap).includes(facetConfig.field)
//   ? { value: _fieldToFilterValueMap[facetConfig.field] }
//   : {}),

// console.log('facetFactories', { _configuredFacetsMap, filters });

// const facetsWithValues = filters.reduce((acc, filter) => {
//   if (Object.keys(_configuredFacetsMap).includes(filter.field)) {
//     const f = _configuredFacetsMap[filter.field].buildFilter(filter, config);
//     if (f) {
//       return [...acc, f];
//     }
//   }
//
//   return acc;
// }, []);
//
// // if (Object.keys(config.filters).includes(filter.field)) {
// //   const { registryConfig } = config.filters[filter.field].factories;
// //   const { buildFilter } = registry.resolve[registryConfig];
// //   const f = buildFilter(filter, config);
// //   return [...acc, f];
// // }
//
// // const appliedFacet
// // request filters are built from the configured facets
//
// const appliedFilterIds = facetsWithValues.map((f) => f.field);
//
// // apply default values from configured filters;
// const appliedFiltersWithDefaults = config.facets.reduce((acc, facet) => {
//   if (!appliedFilterIds.includes(facet.field) && facet.defaultValues) {
//     const filterValue = _configuredFacetsMap[facet.field].buildFilter(
//       {
//         ...facet,
//         values: facet.defaultValues,
//       },
//       config,
//     );
//     if (filterValue) return [...acc, filterValue];
//   }
//   return acc;
// }, facetsWithValues);
//
// (config.permanentFilters || []).forEach((f) =>
//   appliedFiltersWithDefaults.push(isFunction(f) ? f() : f),
// );
//
// boolFilters.forEach((filter) =>
//   appliedFiltersWithDefaults.push(
//     _configuredFacetsMap[filter.field].buildFilter(filter, config),
//   ),
// );
//
// const res = appliedFiltersWithDefaults.length
//   ? appliedFiltersWithDefaults.filter((f) => !!f)
//   : null;
//
// console.log('final', res);
// return res;
