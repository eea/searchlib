import {
  buildRequest,
  runRequest,
  applyDisjunctiveFaceting,
  buildState,
} from './lib/search';
import { Facet } from '@elastic/react-search-ui';
import { simpleFacet } from '@eeacms/search/components/factories';
import { Item, LeftColumnLayout } from '@eeacms/search/components';
import { Item as SUIItem } from 'semantic-ui-react';

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
      name: 'Relevance',
      value: '',
      direction: '',
    },
    {
      name: 'Title',
      value: 'Measure_name',
      direction: 'asc',
    },
  ],
  listingViews: [
    {
      id: 'listing',
      title: 'Items',
      icon: null,
      isDefault: true,
      viewComponent: SUIItem.Group,
      itemComponent: Item,
      titleField: 'Measure_name',
      urlField: 'CodeCatalogue',
      params: {
        titleField: 'Measure_name',
        urlField: null,
        summaryField: null,
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
    },
  ],
};

const config = {
  componentFactories: {
    'searchui.Facet': Facet,
  },

  searchui: {
    default: {
      // debug: true,
      hasA11yNotifications: true,
      layoutComponent: LeftColumnLayout,
      onResultClick: () => {
        /* Not implemented */
      },
      onAutocompleteResultClick: () => {
        /* Not implemented */
      },
      async onAutocomplete(props) {
        const _config = this;
        const { searchTerm } = props;
        const resultsPerPage = 20;
        const requestBody = buildRequest({ searchTerm }, _config);
        const json = await runRequest(requestBody, _config);
        const state = buildState(json.body, resultsPerPage, _config);
        return {
          autocompletedResults: state.results,
        };
      },
      async onSearch(state) {
        const _config = this;
        const { resultsPerPage } = state;
        const requestBody = buildRequest(state, _config);

        // Note that this could be optimized by running all of these requests
        // at the same time. Kept simple here for clarity.
        const responseJson = await runRequest(requestBody, _config);
        const { body } = responseJson;
        const responseJsonWithDisjunctiveFacetCounts = await applyDisjunctiveFaceting(
          body,
          state,
          [],
          _config,
        );

        const newState = buildState(
          responseJsonWithDisjunctiveFacetCounts,
          resultsPerPage,
          _config,
        );
        return newState;
      },
    },

    get wise() {
      return {
        ...config.searchui.default,
        ...wise_config,
      };
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
