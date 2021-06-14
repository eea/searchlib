import {
  suiFacet,
  suiRangeFacet,
  multiTermFacet,
  mergeConfig,
} from '@eeacms/search';

const demo_config = {
  title: 'Global search and catalogue',
  layoutComponent: 'RightColumnLayout',

  extraQueryParams: {
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

  facets: [
    multiTermFacet({
      field: 'topic',
      isFilterable: true,
      isMulti: true,
      label: 'Topics',
      // factory: 'sui.Facet',
    }),
    suiFacet({
      field: 'spatial',
      isFilterable: true,
      isMulti: true,
      label: 'Countries',
    }),
    suiFacet({
      field: 'places',
      isFilterable: true,
      isMulti: true,
      label: 'Regions/Places/Cities/Seas...',
    }),
    suiFacet({
      field: 'type',
      isFilterable: false,
      isMulti: true,
      label: 'Content types',
    }),
    suiFacet({
      field: 'organisation',
      isFilterable: false,
      isMulti: true,
      label: 'Organisation involved',
    }),
    suiFacet({
      field: 'cluster_name',
      isFilterable: false,
      isMulti: true,
      label: 'Websites',
    }),
    suiRangeFacet({
      field: 'year',
      isFilterable: false,
      isMulti: true,
      label: 'Year',
    }),
    suiFacet({
      field: 'language',
      isFilterable: false,
      isMulti: true,
      label: 'Language',
    }),
  ],

  resultViews: [
    {
      id: 'card',
      title: 'Cards',
      icon: null,
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
      icon: null,
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
      Measure_name: {},
    },
  },

  sortOptions: [
    {
      name: 'Title',
      value: 'Measure_name',
      direction: 'asc',
    },
  ],

  cardViewParams: {
    titleField: 'title',
    metatypeField: 'type',
    descriptionField: 'description',
    tagsField: 'topic',
    issuedField: 'issued',
    enabled: true,
  },

  horizontalCardViewParams: {
    titleField: 'title',
    metatypeField: 'type',
    descriptionField: 'description',
    tagsField: 'topic',
    issuedField: 'issued',
    enabled: true,
  },

  listingViewParams: {
    enabled: false,
  },

  tableViewParams: {
    enabled: false,
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
  console.log(process.env.RAZZLE_ENV_CONFIG);

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
