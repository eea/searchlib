import {
  histogramFacet,
  suiFacet,
  suiRangeFacet,
  multiTermFacet,
  mergeConfig,
  makeRange,
  booleanFacet,
} from '@eeacms/search';
import objectProvidesWhitelist from './json/objectProvidesWhitelist.json';
import spatialWhitelist from './json/spatialWhitelist.json';
import placesBlacklist from './json/placesBlacklist.json';
import typesWhitelist from './json/typesWhitelist.json';
import contentTypeNormalize from './json/contentTypeNormalize.json';

function getTodayWithTime() {
  const d = new Date();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const second = d.getSeconds();

  const output = [
    d.getFullYear(),
    '-',
    month < 10 ? '0' : '',
    month,
    '-',
    day < 10 ? '0' : '',
    day,
    'T',
    hour < 10 ? '0' : '',
    hour,
    ':',
    minute < 10 ? '0' : '',
    minute,
    ':',
    second < 10 ? '0' : '',
    second,
    'Z',
  ].join('');
  return output;
}

const today = getTodayWithTime();
const demo_config = {
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
    {
      constant_score: {
        filter: {
          bool: {
            should: [
              { bool: { must_not: { exists: { field: 'issued' } } } },
              { range: { 'issued.date': { lte: today } } },
            ],
          },
        },
      },
    },
  ],

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


    suiRangeFacet({
      field: 'readingTime',
      label: 'Reading time (minutes)',
      rangeType: 'fixed',
      isMulti: true,
      ranges: [
        { from: -1000, to: 1000, key: 'All' },
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
    booleanFacet({
      field: 'published',
      label: 'hide archived?',
      //      defaultValues: [true],
      showInFacetsList: false,
      on: {
        constant_score: {
          filter: {
            bool: {
              should: [
                { bool: { must_not: { exists: { field: 'expires' } } } },
                { range: { expires: { gte: today } } },
              ],
            },
          },
        },
      },
    }),
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
    metatypeField: 'type',
    descriptionField: 'description',
    tagsField: 'topic',
    issuedField: 'issued',
    enabled: true,
    getThumbnailUrl: 'getGlobalsearchThumbUrl',
  },

  horizontalCardViewParams: {
    titleField: 'title',
    metatypeField: 'type',
    descriptionField: 'description',
    tagsField: 'topic',
    issuedField: 'issued',
    enabled: true,
    getThumbnailUrl: 'getGlobalsearchThumbUrl',
  },

  listingViewParams: {
    enabled: false,
  },

  tableViewParams: {
    enabled: false,
  },

  field_filters: {
    type: {
      whitelist: typesWhitelist,
    },
  },
};

// const demo_config = {
//   facets: [
//     suiFacet({ field: 'Country', isFilterable: true, isMulti: true }),
//     suiFacet({ field: 'Sector', isMulti: true }),
//     suiFacet({ field: 'Use_or_activity', label: 'Use or activity' }),
//     suiFacet({ field: 'Status' }),
//     suiFacet({
//       field: 'Origin_of_the_measure',
//       label: 'Origin of the measure',
//     }),
//     suiFacet({
//       field: 'Nature_of_the_measure',
//       label: 'Nature of the measure',
//     }),
//     suiFacet({ field: 'Water_body_category', label: 'Water body category' }),
//     suiFacet({ field: 'Spatial_scope', label: 'Spatial scope' }),
//     suiFacet({ field: 'Measure_Impacts_to', label: 'Measure impacts' }),
//     suiFacet({ field: 'Descriptors' }),
//   ],
//
//   highlight: {
//     fields: {
//       Measure_name: {},
//     },
//   },
//
//   sortOptions: [
//     {
//       name: 'Title',
//       value: 'Measure_name',
//       direction: 'asc',
//     },
//   ],
//
//   tableViewParams: {
//     columns: [
//       {
//         title: 'Measure name',
//         field: 'Measure_name',
//       },
//       {
//         title: 'Origin of the measure',
//         field: 'Origin_of_the_measure',
//       },
//     ],
//   },
//
//   listingViewParams: {
//     titleField: 'Measure_name',
//     // urlField: 'CodeCatalogue',
//     extraFields: [
//       {
//         field: 'Origin_of_the_measure',
//         label: 'Origin of the measure',
//       },
//       {
//         field: 'Nature_of_the_measure',
//         label: 'Nature of the measure',
//       },
//       {
//         field: 'Spatial_scope',
//         label: 'Spatial scope',
//       },
//     ],
//     details: {
//       titleField: 'Measure_name',
//       extraFields: [
//         {
//           field: 'Origin_of_the_measure',
//           label: 'Origin of the measure',
//         },
//         {
//           field: 'Nature_of_the_measure',
//           label: 'Nature of the measure',
//         },
//         {
//           field: 'Spatial_scope',
//           label: 'Spatial scope',
//         },
//       ],
//       sections: [
//         {
//           fields: [
//             {
//               field: 'Use_or_activity',
//               label: 'Use or activity',
//             },
//             {
//               field: 'Measure_Impacts_to',
//               label: 'Measure impacts',
//             },
//           ],
//         },
//         {
//           title: 'Main',
//           fields: [
//             {
//               field: 'Origin_of_the_measure',
//               label: 'Origin of the measure',
//             },
//             {
//               field: 'Nature_of_the_measure',
//               label: 'Nature of the measure',
//             },
//           ],
//         },
//       ],
//     },
//   },
// };

export default function install(config) {
  // console.log(process.env.RAZZLE_ENV_CONFIG);

  const envConfig = process.env.RAZZLE_ENV_CONFIG
    ? JSON.parse(process.env.RAZZLE_ENV_CONFIG)
    : demo_config;

  config.searchui.globalsearch = {
    ...mergeConfig(envConfig, config.searchui.default),
    elastic_index: process.env.RAZZLE_ES_INDEX || '_all',
    host: process.env.RAZZLE_ES_HOST || '',
  };

  config.searchui.standalone = {
    ...mergeConfig(envConfig, config.searchui.default),
    host: process.env.RAZZLE_ES_HOST || '',
    elastic_index: process.env.RAZZLE_ES_INDEX || '_all',
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

  config.resolve.getGlobalsearchThumbUrl = (result, config, fallback) => {
    let image = fallback;
    let has_img = false;
    if (
      result.about.raw.startsWith('http://www.eea.europa.eu/help/glossary/')
    ) {
      image = 'https://www.eea.europa.eu/portal_depiction/term/image_preview';
      has_img = true;
    }
    if (result.objectProvides.raw.indexOf('Country profile') !== -1) {
      image =
        'https://www.eea.europa.eu/portal_depiction/country-profile/image_preview';
      has_img = true;
    }
    if (result.about.raw.indexOf('://land.copernicus.eu') !== -1) {
      image = result.about.raw + '/image_preview';
      has_img = true;
    }
    if (result.about.raw.startsWith('http://www.eea.europa.eu')) {
      image = result.about.raw + '/image_preview';
      has_img = true;
    } else {
      if (!has_img) {
        let contentTypes = contentTypeNormalize;
        let _type;
        let _typeClass;
        let _contentType = 'generic';
        if (!Array.isArray(result.objectProvides.raw)) {
          result.objectProvides.raw = [result.objectProvides.raw];
        }
        if (result.objectProvides.raw.length > 0) {
          var pos = result.objectProvides.raw.length - 1;
          while (true) {
            _type = result.objectProvides.raw[pos];
            _typeClass = _type.toLowerCase().replace(/\s/g, '-');
            if (contentTypes[_typeClass]) {
              _contentType = contentTypes[_typeClass];
              break;
            }
            pos--;
            if (pos < 0) {
              break;
            }
          }
        }
        image =
          'https://www.eea.europa.eu/portal_depiction/' +
          _contentType +
          '/image_preview';
      }
    }

    return image;
  };

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
