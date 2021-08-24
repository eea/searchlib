import {
  histogramFacet,
  suiFacet,
  // suiRangeFacet,
  multiTermFacet,
  mergeConfig,
  makeRange,
  booleanFacet,
  fixedRangeFacet,
} from '@eeacms/search';
import objectProvidesWhitelist from './json/objectProvidesWhitelist.json';
import spatialWhitelist from './json/spatialWhitelist.json';
import placesBlacklist from './json/placesBlacklist.json';
import typesWhitelist from './json/typesWhitelist.json';
import contentTypeNormalize from './json/contentTypeNormalize.json';
import {
  getTodayWithTime,
  getGlobalsearchThumbUrl,
  getGlobalsearchIconUrl,
} from './utils';
import LandingPage from './components/LandingPage';

const globalSearchConfig = {
  title: 'Global search and catalogue',
  layoutComponent: 'RightColumnLayout',

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
      field: 'topic',
      isFilterable: true,
      isMulti: true,
      label: 'Topics',
      // factory: 'sui.Facet',
    }),
    multiTermFacet({
      field: 'spatial',
      isFilterable: true,
      isMulti: true,
      label: 'Countries',
      whitelist: spatialWhitelist,
    }),
    multiTermFacet({
      field: 'places',
      isFilterable: true,
      isMulti: true,
      label: 'Regions/Places/Cities/Seas...',
      blacklist: placesBlacklist,
    }),
    multiTermFacet({
      field: 'objectProvides',
      isFilterable: false,
      isMulti: true,
      label: 'Content types',
      whitelist: objectProvidesWhitelist,
    }),
    suiFacet({
      field: 'organisation',
      isFilterable: false,
      isMulti: true,
      label: 'Organisation involved',
    }),
    multiTermFacet({
      field: 'cluster_name',
      isFilterable: false,
      isMulti: true,
      label: 'Websites',
    }),
    histogramFacet({
      field: 'year',
      // isFilterable: false,
      isMulti: true,
      label: 'Publishing year',
      // TODO: implement split in buckets
      ranges: makeRange({ step: 10, normalRange: [1970, 2100] }),
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
      field: 'time_coverage',
      // isFilterable: false,
      isMulti: true,
      label: 'Time coverage',
      // TODO: implement split in buckets
      ranges: makeRange({ step: 10, normalRange: [1700, 2210] }),
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
      field: 'readingTime',
      label: 'Reading time (minutes)',
      rangeType: 'fixed',
      isMulti: true,
      ranges: [
        { key: 'All' },
        { from: 0, to: 4.99999, key: 'Short (<5 minutes)' },
        { from: 5, to: 24.9999, key: 'Medium (5-25 minutes)' },
        { from: 25, to: 10000, key: 'Large (25+ minutes)' },
        { to: -0.0001, key: 'Unknown' },
      ],
    }),
    multiTermFacet({
      field: 'language',
      isFilterable: false,
      isMulti: true,
      label: 'Language',
      defaultValues: ['en'],
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
  ],

  resultViews: [
    {
      id: 'card',
      title: 'Cards',
      icon: 'th',
      render: null,
      isDefault: true,
      factories: {
        view: 'Card.Group',
        item: 'CardItem',
      },
    },
    {
      id: 'horizontalCard',
      title: 'Horizontal cards',
      icon: 'bars',
      render: null,
      isDefault: false,
      factories: {
        view: 'HorizontalCard.Group',
        item: 'HorizontalCardItem',
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

  cardViewParams: {
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
    factory: 'LandingPage',
  },
  listingViewParams: {
    enabled: false,
  },

  tableViewParams: {
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
        title: 'Regions/Places/Cities/Seas...',
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

export default function install(config) {
  // console.log(process.env.RAZZLE_ENV_CONFIG);
  const envConfig = process.env.RAZZLE_ENV_CONFIG
    ? JSON.parse(process.env.RAZZLE_ENV_CONFIG)
    : globalSearchConfig;

  const pjson = require('../package.json');
  envConfig.app_name = pjson.name;
  envConfig.app_version = pjson.version;

  config.searchui.globalsearch = {
    ...mergeConfig(envConfig, config.searchui.default),
    elastic_index: 'es',
    host: process.env.RAZZLE_ES_PROXY_ADDR || 'http://localhost:3000',
  };

  config.searchui.standalone = {
    ...mergeConfig(envConfig, config.searchui.default),
    host: process.env.RAZZLE_ES_PROXY_ADDR,
    elastic_index: 'es',
    facets: [],
    highlight: {},
    sortOptions: [],
    tableViewParams: {
      columns: [
        {
          title: 'Title',
          field: 'title',
        },
      ],
    },
    listingViewParams: {
      titleField: 'title',
      extraFields: [],
      details: {
        titleField: 'title',
        extraFields: [],
      },
      sections: [],
    },
  };

  config.resolve.getGlobalsearchIconUrl =
    getGlobalsearchIconUrl(contentTypeNormalize);
  config.resolve.getGlobalsearchThumbUrl =
    getGlobalsearchThumbUrl(contentTypeNormalize);

  config.resolve.LandingPage = { component: LandingPage };

  config.searchui.minimal = mergeConfig(config.searchui.default, envConfig);
  config.searchui.minimal.facets = [
    suiFacet({ field: 'Sector' }),
    suiFacet({
      field: 'Origin_of_the_measure',
      label: 'Origin of the measure',
    }),
  ];

  return config;
}
