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
  // defaultFilterValues: {
  // language: {
  //   value: 'en',
  //   type: 'any',
  // },
  // readingTime: {
  //   value: { name: 'All', rangeType: 'fixed' },
  //   type: 'any',
  // },
  // },
};
