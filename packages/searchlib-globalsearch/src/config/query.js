export default {
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
};