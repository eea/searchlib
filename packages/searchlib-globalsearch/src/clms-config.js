import {
  // histogramFacet,
  // suiFacet,
  // suiRangeFacet,
  multiTermFacet,
  mergeConfig,
  // makeRange,
  // booleanFacet,
  // fixedRangeFacet,
} from '@eeacms/search';

import { globalSearchConfig } from './config.js';
function clmsconfig(config) {
  const envConfig = process.env.RAZZLE_ENV_CONFIG
    ? JSON.parse(process.env.RAZZLE_ENV_CONFIG)
    : globalSearchConfig;
  return {
    ...mergeConfig(config.searchui.default, envConfig),
    title: 'Dataset catalogue',
    subheadline:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis luctus mauris ante, a iaculis leo placerat quis. Nullam vitae vulputate leo, et ultricies dolor.',
    REMOVEDhost: process.env.RAZZLE_ES_PROXY_ADDR,
    host: 'http://ulmaarchitectural.cs:9200',
    elastic_index: 'clms',
    enableNLP: false,
    facets: [
      multiTermFacet({
        field: 'tags',
        isFilterable: true,
        isMulti: true,
        label: 'Tags',
        factory: 'MultiTermListFacet',
        // factory: 'sui.Facet',
        wrapper: 'ModalFacetWrapper',
        show: 10000,
      }),
    ],
    highlight: {},
    sortOptions: [
      {
        name: 'Title a-z',
        value: 'title',
        direction: 'asc',
      },
      // {
      //   name: 'Title z-a',
      //   value: 'title',
      //   direction: 'desc',
      // },
      // {
      //   name: 'Oldest',
      //   value: 'issued.date',
      //   direction: 'asc',
      // },
      // {
      //   name: 'Newest',
      //   value: 'issued.date',
      //   direction: 'desc',
      // },
    ],
    defaultFilters: {},
    clmsCardsViewParams: {
      urlField: 'absolute_url',
      titleField: 'title',
      metatypeField: 'objectProvides',
      descriptionField: 'description',
      tagsField: 'tags',
      issuedField: 'issued_date',
      enabled: true,
      getThumbnailUrl: 'getGlobalsearchThumbUrl',
      getIconUrl: 'getGlobalsearchIconUrl',
    },
    resultViews: [
      {
        id: 'clmsCards',
        title: 'CLMS Cards',
        icon: 'bars',
        render: null,
        isDefault: true,
        factories: {
          view: 'CLMSCard.Group',
          item: 'CLMSCardItem',
        },
      },
    ],
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
      score_mode: 'sum',
      facet_boost_functions: {
        query: { match_all: {} },
        boost: '5',
        random_score: {},
        boost_mode: 'multiply',
      },
    },
    searchBoxComponent: 'CLMSSearchBoxView',
    searchBoxInputComponent: 'CLMSSearchInput',
    layoutComponent: 'CLMSLayout',
    contentBodyComponent: 'CLMSContentView',
  };
}

export default clmsconfig;
