import { Facet } from '@elastic/react-search-ui';
import { simpleFacet } from '@eeacms/search/components/factories';
import {
  ListingViewItem,
  LeftColumnLayout,
  TableRowItem,
  TableView,
} from '@eeacms/search/components';
import { Item } from 'semantic-ui-react';
import { mergeConfig } from './utils';
import {
  onResultClick,
  onAutocompleteResultClick,
  onAutocomplete,
  onSearch,
} from './request';

const wise_config = {
  facets: [
    simpleFacet({ field: 'Country', isFilterable: true }),
    simpleFacet({ field: 'Sector' }),
    simpleFacet({ field: 'Use_or_activity', label: 'Use or activity' }),
    simpleFacet({ field: 'Status' }),
    simpleFacet({
      field: 'Origin_of_the_measure',
      label: 'Origin of the measure',
    }),
    simpleFacet({
      field: 'Nature_of_the_measure',
      label: 'Nature of the measure',
    }),
    simpleFacet({ field: 'Water_body_category', label: 'Water body category' }),
    simpleFacet({ field: 'Spatial_scope', label: 'Spatial scope' }),
    simpleFacet({ field: 'Measure_Impacts_to', label: 'Measure impacts' }),
    simpleFacet({ field: 'Descriptors' }),
  ],
  sortOptions: [
    {
      name: 'Title',
      value: 'Measure_name',
      direction: 'asc',
    },
  ],
  tableViewParams: {
    columns: [
      {
        title: 'Measure name',
        field: 'Measure_name',
      },
      {
        title: 'Origin of them easure',
        field: 'Origin_of_the_measure',
      },
    ],
  },
  listingViewParams: {
    titleField: 'Measure_name',
    // urlField: 'CodeCatalogue',
    extraFields: [
      {
        field: 'Origin_of_the_measure',
        label: 'Origin of the measure',
      },
      {
        field: 'Nature_of_the_measure',
        label: 'Nature of the measure',
      },
      {
        field: 'Spatial_scope',
        label: 'Spatial scope',
      },
    ],
  },
};

const config = {
  componentFactories: {
    'searchui.Facet': Facet,
  },

  searchui: {
    default: {
      // debug: true,
      hasA11yNotifications: true,
      onResultClick,
      onAutocompleteResultClick,
      onAutocomplete,
      onSearch,

      // visually layout the search components (header, side, etc)
      layoutComponent: LeftColumnLayout,

      // when entering in search view, use this to search
      defaultSearchText: '',

      resultViews: [
        {
          id: 'listing',
          title: 'Items',
          icon: null,
          render: null,
          isDefault: true,
          viewComponent: Item.Group,
          itemComponent: ListingViewItem,
        },
        {
          id: 'table',
          title: 'Table',
          icon: null,
          render: null,
          isDefault: false,
          viewComponent: TableView,
          itemComponent: TableRowItem,
        },
      ],

      // parameters for the 'listing' Listing View
      // The config will lookup for `${id}ViewParams` objects
      listingViewParams: {
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

    get wise() {
      return mergeConfig(config.searchui.default, wise_config);
    },

    get minimal() {
      return {
        ...config.searchui.default,
        ...wise_config,
        facets: [
          simpleFacet({ field: 'Sector' }),
          simpleFacet({
            field: 'Origin_of_the_measure',
            label: 'Origin of the measure',
          }),
        ],
      };
    },
  },
};

if (window) {
  window.searchUiConfig = config;
}

export default config;
