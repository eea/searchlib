import { simpleFacet } from '@eeacms/search/components/factories';
import { mergeConfig } from './utils';

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
  tableViewParams: {
    columns: [
      {
        title: 'Measure name',
        field: 'Measure_name',
      },
      {
        title: 'Origin of the measure',
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

export default function installDemo(config) {
  // config.searchui.wise = {
  //   ...config.searchui.default,
  //   ...wise_config,
  // };
  config.searchui.wise = mergeConfig(wise_config, config.searchui.default);

  config.searchui.minimal = mergeConfig(config.searchui.default, wise_config);
  config.searchui.minimal.facets = [
    simpleFacet({ field: 'Sector' }),
    simpleFacet({
      field: 'Origin_of_the_measure',
      label: 'Origin of the measure',
    }),
  ];

  return config;
}
