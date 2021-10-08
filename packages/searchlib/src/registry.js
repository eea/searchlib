import React from 'react';
import { SearchBox } from '@elastic/react-search-ui';
import MultiTermFacet from '@eeacms/search/components/Facets/MultiTermFacet';
import MultiTermListFacet from '@eeacms/search/components/Facets/MultiTermListFacet';
import HistogramFacet from '@eeacms/search/components/Facets/HistogramFacet';
import BooleanFacet from '@eeacms/search/components/Facets/BooleanFacet';
import FixedRangeFacet from '@eeacms/search/components/Facets/FixedRangeFacet';
import ModalFixedRangeFacet from '@eeacms/search/components/Facets/ModalFixedRangeFacet';
import {
  AccordionFacetWrapper,
  LeftColumnLayout,
  RightColumnLayout,
  TableRowItem,
  TableView,
  FilterResultEntry,
  MultiCheckboxFacet,
  ModalFacetWrapper,
  FilterAsideLayout,
} from '@eeacms/search/components';

import SimpleSearchInput from '@eeacms/search/components/SearchInput/SimpleSearchInput';
import SearchInput from '@eeacms/search/components/SearchInput/SearchInput';
import ListingViewItem from '@eeacms/search/components/Result/ListingViewItem';
import Facets from '@eeacms/search/components/Facets/Facets';
import CardItem from '@eeacms/search/components/Result/CardItem';
import HorizontalCardItem from '@eeacms/search/components/Result/HorizontalCardItem';
import DefaultContentView from '@eeacms/search/components/SearchView/DefaultContentView';
import FilterAsideContentView from '@eeacms/search/components/SearchView/FilterAsideContentView';
import TilesLandingPage from '@eeacms/search/components/LandingPage/TilesLandingPage';
import { Item, Card, Menu } from 'semantic-ui-react';
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
      component: MultiCheckboxFacet,
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
    ModalFixedRangeFacet: {
      component: ModalFixedRangeFacet,
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
    MultiTermListFacet: {
      component: MultiTermListFacet,
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
    VerticalCardsGroup: {
      component: (props) => <Card.Group {...props} stackable itemsPerRow={1} />,
    },
    VerticalMenu: {
      component: (props) => <Menu vertical {...props} />,
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
    'searchui.SearchBox': {
      component: SearchBox,
    },
    AccordionFacetWrapper: {
      component: AccordionFacetWrapper,
    },
    ModalFacetWrapper: {
      component: ModalFacetWrapper,
    },
    VerticalCardsModalFacets: {
      component: (props) => (
        <Facets
          defaultWraper={ModalFacetWrapper}
          view={({ children }) => (
            <Card.Group {...props} stackable itemsPerRow={1}>
              {children}
            </Card.Group>
          )}
        />
      ),
    },
    FilterAsideLayout: {
      component: FilterAsideLayout,
    },
    DefaultContentView: {
      component: DefaultContentView,
    },
    FilterAsideContentView: {
      component: FilterAsideContentView,
    },
    TilesLandingPage: {
      component: TilesLandingPage,
    },
    DefaultFacetsList: {
      component: ({ children }) => <div className="facets">{children}</div>,
    },
  },

  searchui: {
    default: {
      host: 'http://localhost:9200',
      elastic_index: '_all',
      title: 'Search catalogue', // the main search app headline
      subheadline: '', // text under the headline
      // debug: true,
      hasA11yNotifications: true,
      onResultClick,
      onAutocompleteResultClick,
      onAutocomplete,
      onSearch,

      // broad global layout (header, side, etc)
      layoutComponent: 'LeftColumnLayout', // The global layout component

      // the SearchBox is a wrapper over the SearcBoxInput component
      searchBoxInputComponent: 'DefaultSearchInput',

      // the "content" layout, everything below the search input
      contentBodyComponent: 'DefaultContentView',

      useSearchPhrases: true,

      // when entering in search view, this will be the default search text
      defaultSearchText: '',

      highlight: {
        fragment_size: 200,
        number_of_fragments: 1,
        fields: {},
      },

      facets: [], // interactive filtering components (facets)
      defaultFilters: {}, // filters that are applied by default

      enableNLP: false, // enables NLP capabilities
      nlp: {
        classifyQuestion: {
          servicePath: 'query-classifier',
        },
        qa: {
          servicePath: 'query',
          cutoffScore: 0.5,
        },
        similarity: {
          servicePath: 'similarity',
          cutoffScore: 0.9,
        },
      },

      contentSectionsParams: {
        // This enables the content as section tabs
        enable: false,
        sectionFacetsField: 'objectProvides',
        icons: {
          News: '',
        },
      },

      filters: {
        // registration of filter options
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
        factory: null, // the "Landing page" component
      },
      noResultView: {
        factory: null, // Component used for "No results" view
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
          icon: 'table',
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
