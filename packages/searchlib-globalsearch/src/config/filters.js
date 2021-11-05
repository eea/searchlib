import objectProvidesWhitelist from './json/objectProvidesWhitelist.json';
import spatialWhitelist from './json/spatialWhitelist.json';
import placesBlacklist from './json/placesBlacklist.json';
import typesWhitelist from './json/typesWhitelist.json';
import { getTodayWithTime } from '../utils';

export default {
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
  defaultFilters: {
    language: {
      value: 'en',
      type: 'any',
    },
    readingTime: {
      value: { name: 'All', rangeType: 'fixed' },
      type: 'any',
    },
  },
  field_filters: {
    type: {
      whitelist: typesWhitelist,
    },
    objectProvides: {
      whitelist: objectProvidesWhitelist,
    },
    spatial: {
      whitelist: spatialWhitelist,
    },
    places: {
      blacklist: placesBlacklist,
    },
  },
};
