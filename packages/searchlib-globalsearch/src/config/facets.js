import {
  booleanFacet,
  dateRangeFacet,
  fixedRangeFacet,
  histogramFacet,
  makeRange,
  multiTermFacet,
} from '@eeacms/search';
import spatialWhitelist from './json/spatialWhitelist.json';
import placesBlacklist from './json/placesBlacklist.json';
import topicsBlacklist from './json/topicsBlacklist.json';
import { getTodayWithTime } from '../utils';

const facets = [
  booleanFacet(() => ({
    field: 'IncludeArchived',
    label: 'Include archived content',
    id: 'archived-facet',
    showInFacetsList: false,
    showInSecondaryFacetsList: true,
    isFilter: true, // filters don't need facet options to show up

    // we want this to be applied by default
    // when the facet is checked, then apply the `on` key:
    off: {
      constant_score: {
        filter: {
          bool: {
            should: [
              { bool: { must_not: { exists: { field: 'expires' } } } },
              // Functions should be supported in the buildFilters
              { range: { expires: { gte: getTodayWithTime() } } },
            ],
          },
        },
      },
    },
    on: null,
  })),
  multiTermFacet({
    field: 'moreLikeThis',
    isFilterable: true,
    isMulti: false,
    label: 'More like this',
    showInFacetsList: false,
    filterListComponent: 'MoreLikeThisEntry',
    factory: 'MoreLikeThis',
    condition: 'like',
    queryParams: {
      fields: ['title', 'text'],
      min_term_freq: 1,
      max_query_terms: 12,
    },

    // registryConfig: 'MoreLikeThis',
  }),
  multiTermFacet({
    field: 'topic',
    isFilterable: true,
    isMulti: true,
    label: 'Topics',
    blacklist: topicsBlacklist,
    factory: 'MultiTermListFacet',
    wrapper: 'ModalFacetWrapper',
    show: 10000,
    showAllOptions: true, // show all options (even if 0) in modal facet
    // factory: 'sui.Facet',
  }),
  multiTermFacet({
    field: 'spatial',
    isFilterable: true,
    isMulti: true,
    label: 'Countries',
    whitelist: spatialWhitelist,
    wrapper: 'ModalFacetWrapper',
    show: 10000,
    factory: 'MultiTermListFacet',
    iconsFamily: 'Countries',
    enableExact: true,
    sortOn: 'value',
  }),
  multiTermFacet({
    field: 'op_cluster',
    isFilterable: true,
    isMulti: true,
    label: 'Section',
    wrapper: 'ModalFacetWrapper',
    show: 10000,
    factory: 'MultiTermListFacet',
    showInFacetsList: false,
  }),

  multiTermFacet({
    field: 'places',
    isFilterable: true,
    isMulti: true,
    label: 'Regions/Places/Cities/Seas...',
    blacklist: placesBlacklist,
    wrapper: 'ModalFacetWrapper',
    show: 10000,
    factory: 'MultiTermListFacet',
    showAllOptions: true, // show all options (even if 0) in modal facet
  }),
  multiTermFacet({
    field: 'objectProvides',
    isFilterable: false,
    isMulti: true,
    label: 'Content types',
    iconsFamily: 'Content types',
    //whitelist: objectProvidesWhitelist,
    wrapper: 'ModalFacetWrapper',
    factory: 'MultiTermListFacet',
    optionsFilter: 'typesForClustersOptionsFilter',
  }),
  multiTermFacet({
    field: 'cluster_name',
    isFilterable: false,
    isMulti: true,
    label: 'Sources',
    wrapper: 'ModalFacetWrapper',
    factory: 'MultiTermListFacet',
    iconsFamily: 'Sources',
  }),
  histogramFacet({
    wrapper: 'ModalFacetWrapper',
    field: 'year',
    // isFilterable: false,
    isMulti: true,
    label: 'Publishing year',
    // TODO: implement split in buckets
    ranges: makeRange({
      step: 1,
      normalRange: [1994, 2022],
      includeOutlierStart: false,
      includeOutlierEnd: false,
    }),
    step: 10,
    // [
    //   {
    //     to: 1900,
    //   },
    //   {
    //     key: '2001-2010',
    //     from: 2001,
    //     to: 2010,
    //   },
    //   {
    //     from: 2011,
    //   },
    // ]
    // min_max_script:
    //
    //"def vals = doc['year']; if (vals.length == 0){return 2000} else {def ret = [];for (val in vals){def tmp_val = val.substring(0,4);ret.add(tmp_val.toLowerCase() == tmp_val.toUpperCase() ? Integer.parseInt(tmp_val) : 2000);}return ret;}",

    aggs_script:
      "def vals = doc['year']; if (vals.length == 0){return 2500} else {def ret = [];for (val in vals){def tmp_val = val.substring(0,4);ret.add(tmp_val.toLowerCase() == tmp_val.toUpperCase() ? Integer.parseInt(tmp_val) : 2500);}return ret;}",
  }),

  histogramFacet({
    wrapper: 'ModalFacetWrapper',
    field: 'time_coverage',
    // isFilterable: false,
    isMulti: true,
    label: 'Time coverage',
    // TODO: implement split in buckets
    ranges: makeRange({
      step: 10,
      normalRange: [1700, 2210],
      includeOutlierStart: false,
      includeOutlierEnd: false,
    }),
    step: 10,
    // [
    //   {
    //     to: 1900,
    //   },
    //   {
    //     key: '2001-2010',
    //     from: 2001,
    //     to: 2010,
    //   },
    //   {
    //     from: 2011,
    //   },
    // ]
    // min_max_script:
    //
    //"def vals = doc['year']; if (vals.length == 0){return 2000} else {def ret = [];for (val in vals){def tmp_val = val.substring(0,4);ret.add(tmp_val.toLowerCase() == tmp_val.toUpperCase() ? Integer.parseInt(tmp_val) : 2000);}return ret;}",

    aggs_script:
      "def vals = doc['time_coverage']; if (vals.length == 0){return 2500} else {def ret = [];for (val in vals){def tmp_val = val.substring(0,4);ret.add(tmp_val.toLowerCase() == tmp_val.toUpperCase() ? Integer.parseInt(tmp_val) : 2500);}return ret;}",
  }),

  fixedRangeFacet({
    wrapper: 'ModalFacetWrapper',
    field: 'readingTime',
    label: 'Reading time (minutes)',
    rangeType: 'fixed',
    isMulti: true,
    ranges: [
      { key: 'All' },
      { from: 0, to: 4.99999, key: 'Short (<5 minutes)' },
      { from: 5, to: 24.9999, key: 'Medium (5-25 minutes)' },
      { from: 25, to: 10000, key: 'Large (25+ minutes)' },
      //        { to: -0.0001, key: 'Unknown' },
    ],
    factory: 'ModalFixedRangeFacet',
    default: {
      values: [{ name: 'All', rangeType: 'fixed' }],
      type: 'any',
    },
  }),
  dateRangeFacet({
    field: 'issued.date',
    label: ' ',
    isFilter: true, // filters don't need facet options to show up
    showInFacetsList: false,
    showInSecondaryFacetsList: true,
    // rangeType: 'dateRange',
    isMulti: false,
    ranges: [
      { key: 'All time' },
      { key: 'Last week', from: 'now-1w', to: 'now' },
      { key: 'Last month', from: 'now-1m', to: 'now' },
      { key: 'Last 3 months', from: 'now-3m', to: 'now' },
      { key: 'Last year', from: 'now-1y', to: 'now' },
      { key: 'Last 2 years', from: 'now-2y', to: 'now' },
    ],
    factory: 'DropdownRangeFilter',
    default: {
      values: ['All time'],
      type: 'any',
    },
  }),
  multiTermFacet({
    wrapper: 'ModalFacetWrapper',
    field: 'language',
    isFilterable: false,
    isMulti: true,
    label: 'Language',
    default: {
      values: ['en'],
      type: 'any',
    },
    factory: 'MultiTermListFacet',
    facetValues: [
      'ar',
      'sr',
      'sq',
      'bg',
      'bs',
      'cs',
      'hr',
      'da',
      'nl',
      'el',
      'en',
      'et',
      'fi',
      'fr',
      'ga',
      'de',
      'hu',
      'is',
      'it',
      'lv',
      'lt',
      'mk',
      'mt',
      'no',
      'pl',
      'pt',
      'ro',
      'ru',
      'sh',
      'sk',
      'sl',
      'es',
      'sv',
      'tr',
    ],
    sortOn: 'custom',
    sortOnCustomLabel: 'Alphabetical',
  }),
];

export default {
  facets,
};

// default filter values
// TODO: this needs to be removed and the configuration plugged into each of
// the facets
// readingTime: {
//   value: { name: 'All', rangeType: 'fixed' },
//   type: 'any',
// },
// },
