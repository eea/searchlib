import {
  histogramFacet,
  // suiFacet,
  // suiRangeFacet,
  multiTermFacet,
  // mergeConfig,
  makeRange,
  booleanFacet,
  fixedRangeFacet,
} from '@eeacms/search';
import objectProvidesWhitelist from './json/objectProvidesWhitelist.json';
import spatialWhitelist from './json/spatialWhitelist.json';
import placesBlacklist from './json/placesBlacklist.json';
import typesWhitelist from './json/typesWhitelist.json';
// import contentTypeNormalize from './json/contentTypeNormalize.json';
import {
  getTodayWithTime,
  // getGlobalsearchThumbUrl,
  // getGlobalsearchIconUrl,
} from './utils';

const globalSearchConfig = {
  title: 'Global search and catalogue',
  layoutComponent: 'FilterAsideLayout',
  contentBodyComponent: 'FilterAsideContentView',
  enableNLP: false, // enables NLP capabilities
  facetsListComponent: 'VerticalCardsModalFacets',

  extraQueryParams: {
    text_fields: [
      'title^2',
      'subject^1.5',
      'description^1.5',
      'searchable_spatial^1.2',
      'searchable_places^1.2',
      'searchable_objectProvides^1.4',
      'searchable_topics^1.2',
      'searchable_time_coverage^10',
      'searchable_organisation^2',
      'label',
      'all_fields_for_freetext',
    ],
    functions: [
      {
        exp: {
          'issued.date': {
            offset: '30d',
            scale: '1800d',
          },
        },
      },
      {
        script_score: {
          script: "doc['items_count_references'].value*0.01",
        },
      },
    ],
    score_mode: 'sum',
    facet_boost_functions: {
      topic: {
        linear: {
          items_count_topic: {
            scale: 1,
            origin: 0,
          },
        },
      },
      spatial: {
        linear: {
          items_count_spatial: {
            scale: 1,
            origin: 0,
          },
        },
      },
      places: {
        linear: {
          items_count_places: {
            scale: 1,
            origin: 0,
          },
        },
      },
      organisation: {
        linear: {
          items_count_organisation: {
            scale: 1,
            origin: 0,
          },
        },
      },
    },
  },
  permanentFilters: [
    { term: { hasWorkflowState: 'published' } },
    () => ({
      constant_score: {
        filter: {
          bool: {
            should: [
              { bool: { must_not: { exists: { field: 'issued' } } } },
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

  facets: [
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
      field: 'places',
      isFilterable: true,
      isMulti: true,
      label: 'Regions / Places / Cities / Seas...',
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
      whitelist: objectProvidesWhitelist,
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
        step: 10,
        normalRange: [1970, 2100],
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

    multiTermFacet({
      showInFacetsList: false,
      field: 'objectProvides',
      isFilterable: false,
      isMulti: true,
    }),
  ],

  resultViews: [
    {
      id: 'horizontalCard',
      title: 'Horizontal cards',
      icon: 'bars',
      render: null,
      isDefault: true,
      factories: {
        view: 'HorizontalCard.Group',
        item: 'HorizontalCardItem',
      },
    },
    {
      id: 'card',
      title: 'Cards',
      icon: 'th',
      render: null,
      isDefault: false,
      factories: {
        view: 'Card.Group',
        item: 'CardItem',
      },
    },
  ],

  highlight: {
    fields: {
      // Measure_name: {},
    },
  },

  sortOptions: [
    {
      name: 'Title a-z',
      value: 'title',
      direction: 'asc',
    },
    {
      name: 'Title z-a',
      value: 'title',
      direction: 'desc',
    },
    {
      name: 'Oldest',
      value: 'issued.date',
      direction: 'asc',
    },
    {
      name: 'Newest',
      value: 'issued.date',
      direction: 'desc',
    },
  ],

  contentSectionsParams: {
    // This enables the content as section tabs
    enable: true,
    sectionFacetsField: 'objectProvides',
    labels: {
      News: 'News',
    },
    icons: {
      News: '',
    },
  },

  cardViewParams: {
    urlField: 'about',
    titleField: 'title',
    metatypeField: 'objectProvides',
    descriptionField: 'description',
    tagsField: 'topic',
    issuedField: 'issued',
    enabled: true,
    getThumbnailUrl: 'getGlobalsearchThumbUrl',
    getIconUrl: 'getGlobalsearchIconUrl',
  },

  horizontalCardViewParams: {
    urlField: 'about',
    titleField: 'title',
    metatypeField: 'objectProvides',
    descriptionField: 'description',
    tagsField: 'topic',
    issuedField: 'issued',
    enabled: true,
    getThumbnailUrl: 'getGlobalsearchThumbUrl',
    getIconUrl: 'getGlobalsearchIconUrl',
  },

  initialView: {
    factory: 'TilesLandingPage',
    tilesLandingPageParams: {
      maxPerSection: 30,
      sections: [
        {
          id: 'topics',
          title: 'Topics',
          facetField: 'topic',
        },
        {
          id: 'organisations',
          title: 'Organisations',
          facetField: 'organisation',
        },
        {
          id: 'countries',
          title: 'Countries',
          facetField: 'spatial',
        },
      ],
    },
  },
  listingViewParams: {
    enabled: false,
  },

  tableViewParams: {
    titleField: 'title',
    urlField: 'about',
    enabled: true,
    columns: [
      {
        title: 'Title',
        field: 'title',
      },
      {
        title: 'Description',
        field: 'description',
      },
      {
        title: 'Countries',
        field: 'spatial',
      },
      {
        title: 'Regions / Places / Cities / Seas...',
        field: 'places',
      },
      {
        title: 'Content types',
        field: 'objectProvides',
      },
      {
        title: 'Topics',
        field: 'topic',
      },
      {
        title: 'Issued',
        field: 'issued',
      },
      {
        title: 'Time coverage',
        field: 'time_coverage',
      },
      {
        title: 'Format',
        field: 'format',
      },
    ],
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

  download_fields: [
    {
      field: 'about',
      name: 'About',
    },
    {
      field: 'description',
      name: 'Description',
    },
    {
      field: 'subject',
      name: 'Subject',
    },
    {
      field: 'issued',
      name: 'Issued',
    },
  ],
};

export default globalSearchConfig;