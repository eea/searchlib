import React from 'react';
// import { Facet } from '@elastic/react-search-ui';
import MultiTermFacet from '@eeacms/search/components/Facets/TermFacet';
import HistogramFacet from '@eeacms/search/components/Facets/HistogramFacet';
import BooleanFacet from '@eeacms/search/components/Facets/BooleanFacet';
import FixedRangeFacet from '@eeacms/search/components/Facets/FixedRangeFacet';
import {
  Facet,
  LeftColumnLayout,
  RightColumnLayout,
  TableRowItem,
  TableView,
  FilterResultEntry,
} from '@eeacms/search/components';

import SimpleSearchInput from '@eeacms/search/components/SearchInput/SimpleSearchInput';
import SearchInput from '@eeacms/search/components/SearchInput/SearchInput';
import ListingViewItem from '@eeacms/search/components/Result/ListingViewItem';
import CardItem from '@eeacms/search/components/Result/CardItem';
import HorizontalCardItem from '@eeacms/search/components/Result/HorizontalCardItem';
import { Item, Card } from 'semantic-ui-react';
import {
  onResultClick,
  onAutocompleteResultClick,
  onAutocomplete,
  onSearch,
} from './lib/request';
import {
  getTermFilter,
  getRangeFilter,
  getValueFacet,
  getRangeFacet,
  getHistogramFilter,
  getBooleanFilter,
  getBooleanFacet,
  buildTermFacetAggregationRequest,
  buildHistogramFacetAggregationRequest,
  buildRangeFacetAggregationRequest,
  buildMLTFilter,
  // getHistogramFacet,
  // getMLTValue,
  buildBooleanFacetRequest,
} from '@eeacms/search/lib/search';

const config = {
  resolve: {
    'searchui.Facet': {
      component: Facet,
      // the facet aggregation part
      buildRequest: buildTermFacetAggregationRequest,

      // the query filter part
      buildFilter: getTermFilter,

      // get the filter value based on query that was run
      getValue: getValueFacet,
    },
    'searchui.RangeFacet': {
      component: MultiTermFacet,
      buildRequest: buildRangeFacetAggregationRequest,
      buildFilter: getRangeFilter,
      getValue: getRangeFacet,
    },
    FixedRangeFacet: {
      component: FixedRangeFacet,
      buildRequest: buildRangeFacetAggregationRequest,
      buildFilter: getRangeFilter,
      getValue: getRangeFacet,
    },
    BooleanFacet: {
      component: BooleanFacet,
      buildRequest: buildBooleanFacetRequest,
      buildFilter: getBooleanFilter,
      getValue: getBooleanFacet,
    },
    MultiTermFacet: {
      component: MultiTermFacet,
      buildRequest: buildTermFacetAggregationRequest,
      buildFilter: getTermFilter,
      getValue: getValueFacet,
    },
    HistogramFacet: {
      component: HistogramFacet,
      buildRequest: buildHistogramFacetAggregationRequest,
      buildFilter: getHistogramFilter,
      getValue: getRangeFacet,
    },
    MoreLikeThis: {
      buildFilter: buildMLTFilter('like'),
    },
    LessLikeThis: {
      buildFilter: buildMLTFilter('unlike'),
    },
    'Item.Group': {
      component: Item.Group,
    },
    'Card.Group': {
      component: (props) => (
        <Card.Group {...props} stackable itemsPerRow={4} doubling />
      ),
    },
    'HorizontalCard.Group': {
      component: (props) => (
        <Card.Group {...props} stackable itemsPerRow={1} doubling />
      ),
    },
    ListingViewItem: {
      component: ListingViewItem,
    },
    CardItem: {
      component: CardItem,
    },
    HorizontalCardItem: {
      component: HorizontalCardItem,
    },
    TableView: {
      component: TableView,
    },
    TableRowItem: {
      component: TableRowItem,
    },
    LeftColumnLayout: {
      component: LeftColumnLayout,
    },
    RightColumnLayout: {
      component: RightColumnLayout,
    },
    FilterResultEntry: {
      component: FilterResultEntry,
    },
    SimpleSearchInput: {
      component: SimpleSearchInput,
    },
    DefaultSearchInput: {
      component: SearchInput,
    },
  },

  searchui: {
    default: {
      host: 'http://localhost:9200',
      elastic_index: '_all',
      // debug: true,
      hasA11yNotifications: true,
      onResultClick,
      onAutocompleteResultClick,
      onAutocomplete,
      onSearch,

      searchBoxComponent: 'DefaultSearchInput',

      // visually layout the search components (header, side, etc)
      layoutComponent: 'LeftColumnLayout',

      // when entering in search view, use this to search
      defaultSearchText: '',

      highlight: {
        fragment_size: 200,
        number_of_fragments: 1,
        fields: {},
      },

      facets: [],

      filters: {
        moreLikeThis: {
          enabled: true,
          fields: ['title', 'text'],
          factories: {
            registryConfig: 'MoreLikeThis',
            filterList: 'FilterResultEntry',
          },
        },
        // lessLikeThis: {
        //   enabled: true,
        //   fields: ['title', 'text'],
        //   factories: {
        //     registryConfig: 'LessLikeThis',
        //     filterList: 'FilterResultEntry',
        //   },
        // },
      },

      autocomplete: {
        include_searchterm: true,
        hint_min_words: 3,
        results: {
          titleField: 'title',
          urlField: 'id',
          sectionTitle: 'Results',
          linkTarget: '_blank',
        },
        suggestions: {
          didYouMean: {
            sectionTitle: 'Did you mean...',
          },
        },

        // {
        //   linkTarget: '_blank',
        //   sectionTitle: 'Results',
        //   titleField: 'title',
        //   urlField: 'id',
        //   shouldTrackClickThrough: true,
        //   clickThroughTags: ['test'],
        // }
      },

      initialView: {
        factory: null,
      },
      noResultView: {
        factory: null,
      },
      resultViews: [
        {
          id: 'listing',
          title: 'Items',
          icon: null,
          render: null,
          isDefault: true,
          factories: {
            view: 'Item.Group',
            item: 'ListingViewItem',
          },
        },
        {
          id: 'table',
          title: 'Table',
          icon: null,
          render: null,
          isDefault: false,
          factories: {
            view: 'TableView',
            item: 'TableRowItem',
          },
        },
      ],

      // parameters for the 'listing' Listing View
      // The config will lookup for `${id}ViewParams` objects
      listingViewParams: {
        enabled: true,
      },

      cardViewParams: {
        enabled: true,
      },

      tableViewParams: {
        enabled: true,
      },

      sortOptions: [
        {
          name: 'Relevance',
          value: '',
          direction: '',
        },
      ],
    },
  },
};

// if (window) {
//   window.searchUiConfig = config;
// }

export default config;
