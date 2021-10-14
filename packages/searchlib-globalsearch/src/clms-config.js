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

import {
  getTodayWithTime,
  // getGlobalsearchThumbUrl,
  // getGlobalsearchIconUrl,
} from './utils';

import {
  CLMSSearchBoxView,
  CLMSSearchInput,
  CLMSLayout,
  CLMSContentView,
  CLMSCardItem,
  CLMSModalFacetWrapper,
  CLMSMultiTermListFacet,
  CLMSSortingDropdown,
  CLMSSortingDropdownWrapper,
  // CLMSVerticalCardsModalFacets,
} from './components/CLMS';

import { ModalFacetWrapper } from '@eeacms/search/components';
import { Card } from 'semantic-ui-react';

import {
  getTermFilter,
  getValueFacet,
  buildTermFacetAggregationRequest,
} from '@eeacms/search/lib/search';
import FacetsList from '@eeacms/search/components/Facets/FacetsList';

import globalSearchConfig from './global-search-config.js';
function clmssearchui(config) {
  const baseFacet = {
    isFilterable: true,
    isMulti: true,
    // factory: 'MultiTermListFacet',
    factory: 'CLMSMultiTermListFacet',
    // factory: 'sui.Facet',
    wrapper: 'CLMSModalFacetWrapper',
    show: 10000,
    showSearch: false,
  };
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
        field: 'topics.keyword',
        label: 'Keywords',
        ...baseFacet,
      }),
      multiTermFacet({
        field: 'inspire_themes.keyword',
        label: 'INSPIRE themes',
        ...baseFacet,
      }),
      multiTermFacet({
        field: 'classification_topic_category.keyword',
        label: 'GEMET keyword',
        ...baseFacet,
      }),
      multiTermFacet({
        field: 'temporal_coverage.keyword',
        label: 'Temporal coverage',
        ...baseFacet,
      }),
      multiTermFacet({
        field: 'update_frequency.keyword',
        label: 'Update frequency',
        ...baseFacet,
      }),
      multiTermFacet({
        field: 'resource_type.keyword',
        label: 'Resource type',
        ...baseFacet,
      }),
      // multiTermFacet({
      //   field: 'content_type.keyword',
      //   isFilterable: true,
      //   isMulti: true,
      //   label: 'CT',
      //   factory: 'CLMSMultiTermListFacet',
      //   // factory: 'BooleanFacet',
      //   wrapper: 'CLMSModalFacetWrapper',
      //   show: 10000,
      //   showSearch: false,
      // }),
    ],
    highlight: {},
    sortOptions: [
      {
        name: 'Title a-z',
        value: 'title.keyword',
        direction: 'asc',
      },
      {
        name: 'Title z-a',
        value: 'title.keyword',
        direction: 'desc',
      },
      {
        name: 'Oldest',
        value: 'issued_date',
        direction: 'asc',
      },
      {
        name: 'Newest',
        value: 'issued_date',
        direction: 'desc',
      },
    ],
    defaultFilters: {
      content_type: {
        value: 'DataSet',
        type: 'all',
      },
    },
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
        // query: { match_all: {} },
        // boost: '5',
        // random_score: {},
        // boost_mode: 'multiply',
        // 'topics.keyword': {
        //   linear: {
        //     items_count_topics: {
        //       scale: 1,
        //       origin: 0,
        //     },
        //   },
        // },
      },
    },
    permanentFilters: [
      // { term: { hasWorkflowState: 'published' } },
      // {

      // },
      () => ({
        constant_score: {
          filter: {
            bool: {
              should: [
                {
                  bool: { must_not: { exists: { field: 'issued_date' } } },
                },
                { range: { issued_date: { lte: getTodayWithTime() } } },
              ],
              must: [
                {
                  term: {
                    'content_type.keyword': 'DataSet',
                  },
                },
                //   // { bool: { must: { exists: { field: 'content_type' } } } },
                //   { query: { "content_type.keyword": { match: 'DataSet' } } },
              ],
            },
          },
        },
      }),
    ],
    searchBoxComponent: 'CLMSSearchBoxView',
    searchBoxInputComponent: 'CLMSSearchInput',
    layoutComponent: 'CLMSLayout',
    contentBodyComponent: 'CLMSContentView',
    facetsListComponent: 'VerticalFacets',
  };
}

function clmsresolve(config) {
  return {
    ...config.resolve,
    CLMSSearchBoxView: {
      component: CLMSSearchBoxView,
    },
    CLMSSearchInput: {
      component: CLMSSearchInput,
    },
    CLMSLayout: {
      component: CLMSLayout,
    },
    CLMSContentView: {
      component: CLMSContentView,
    },
    'CLMSCard.Group': {
      component: (props) => (
        <Card.Group {...props} stackable itemsPerRow={1} doubling />
      ),
    },
    CLMSCardItem: {
      component: CLMSCardItem,
    },
    CLMSModalFacetWrapper: {
      component: CLMSModalFacetWrapper,
    },
    CLMSMultiTermListFacet: {
      component: CLMSMultiTermListFacet,
      buildRequest: buildTermFacetAggregationRequest,
      buildFilter: getTermFilter,
      getValue: getValueFacet,
    },
    VerticalFacets: {
      component: (props) => (
        <>
          <CLMSSortingDropdownWrapper
            label={'Sort by'}
            sortOptions={config.searchui.clms.sortOptions}
            view={CLMSSortingDropdown}
          />
          <FacetsList
            defaultWraper={ModalFacetWrapper}
            view={({ children }) => (
              <nav className="dropdown-filters">{children}</nav>
            )}
          />
        </>
      ),
    },
    // CLMSVerticalCardsModalFacets: {
    //   component: CLMSVerticalCardsModalFacets,
    // },
  };
}

export { clmssearchui, clmsresolve };
