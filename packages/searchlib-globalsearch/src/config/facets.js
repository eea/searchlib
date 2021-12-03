import {
  histogramFacet,
  multiTermFacet,
  makeRange,
  booleanFacet,
  fixedRangeFacet,
} from '@eeacms/search';
import spatialWhitelist from './json/spatialWhitelist.json';
import placesBlacklist from './json/placesBlacklist.json';
import { getTodayWithTime } from '../utils';

const facets = [
  multiTermFacet({
    field: 'moreLikeThis',
    isFilterable: true,
    isMulti: true,
    label: 'More like this',
    showInFacetsList: false,
  }),
  multiTermFacet({
    field: 'topic',
    isFilterable: true,
    isMulti: true,
    label: 'Topics',
    factory: 'MultiTermListFacet',
    // factory: 'sui.Facet',
    wrapper: 'ModalFacetWrapper',
    show: 10000,
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
  }),
  multiTermFacet({
    field: 'objectProvides',
    isFilterable: false,
    isMulti: true,
    label: 'Content types',
    //whitelist: objectProvidesWhitelist,
    wrapper: 'ModalFacetWrapper',
    factory: 'MultiTermListFacet',
  }),
  multiTermFacet({
    field: 'organisation',
    isFilterable: false,
    isMulti: true,
    label: 'Organisation involved',
    wrapper: 'ModalFacetWrapper',
    factory: 'MultiTermListFacet',
  }),
  multiTermFacet({
    field: 'cluster_name',
    isFilterable: false,
    isMulti: true,
    label: 'Websites',
    wrapper: 'ModalFacetWrapper',
    factory: 'MultiTermListFacet',
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
      normalRange: [1958, 2022],
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
  }),
  multiTermFacet({
    wrapper: 'ModalFacetWrapper',
    field: 'language',
    isFilterable: false,
    isMulti: true,
    label: 'Language',
    defaultValues: ['en'],
    factory: 'MultiTermListFacet',
  }),
  booleanFacet(() => ({
    field: 'Include archived content',
    label: 'Include archived content',
    showInFacetsList: false,
    off: {
      constant_score: {
        filter: {
          bool: {
            should: [
              { bool: { must_not: { exists: { field: 'expires' } } } },
              { range: { expires: { gte: getTodayWithTime() } } },
            ],
          },
        },
      },
    },
  })),

  /*    multiTermFacet({
          showInFacetsList: false,
          field: 'objectProvides',
          isFilterable: false,
          isMulti: true,
        }),*/
];

export default {
  facets,
};
