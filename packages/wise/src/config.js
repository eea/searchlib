import { suiFacet, mergeConfig } from '@eeacms/search';

const wise_config = {
  layoutComponent: 'RightColumnLayout',
  facets: [
    suiFacet({
      field: 'Origin_of_the_measure',
      label: 'Origin of the measure',
    }),
    suiFacet({ field: 'Sector', isMulti: true }),
    suiFacet({ field: 'Descriptors' }),
    // suiFacet({ field: 'Country', isFilterable: true, isMulti: true }),
    // suiFacet({ field: 'Use_or_activity', label: 'Use or activity' }),
    // suiFacet({ field: 'Status' }),
    // suiFacet({
    //   field: 'Nature_of_the_measure',
    //   label: 'Nature of the measure',
    // }),
    // suiFacet({ field: 'Water_body_category', label: 'Water body category' }),
    // suiFacet({ field: 'Spatial_scope', label: 'Spatial scope' }),
    // suiFacet({ field: 'Measure_Impacts_to', label: 'Measure impacts' }),
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
    urlField: 'CodeCatalogue',
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
    details: {
      titleField: 'Measure_name',
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
      sections: [
        {
          fields: [
            {
              field: 'Use_or_activity',
              label: 'Use or activity',
            },
            {
              field: 'Measure_Impacts_to',
              label: 'Measure impacts',
            },
          ],
        },
        {
          title: 'Main',
          fields: [
            {
              field: 'Origin_of_the_measure',
              label: 'Origin of the measure',
            },
            {
              field: 'Nature_of_the_measure',
              label: 'Nature of the measure',
            },
          ],
        },
      ],
    },
  },
};

export default function installDemo(config) {
  config.searchui.wise = mergeConfig(wise_config, config.searchui.default);

  config.searchui.minimal = mergeConfig(config.searchui.default, wise_config);
  config.searchui.minimal.facets = [
    suiFacet({ field: 'Sector' }),
    suiFacet({
      field: 'Origin_of_the_measure',
      label: 'Origin of the measure',
    }),
  ];

  return config;
}

