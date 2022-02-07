export default {
  debugQuery: false,
  extraQueryParams: {
    text_fields: [
      'title^2',
      'subject^1.5',
      'description^1.5',
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
    ],
    score_mode: 'sum',
  },
  // extraQAQueryFilters: {
  //   should: [
  //     {
  //       multi_match: {
  //         query: 'News Articles Briefing',
  //         minimum_should_match: '0%',
  //         fields: ['searchable_objectProvides'],
  //       },
  //     },
  //   ],
  // },
  // extraRAWQueryFilters: {
  //   should: [
  //     {
  //       multi_match: {
  //         query: 'News Articles Briefing',
  //         minimum_should_match: '0%',
  //         fields: ['searchable_objectProvides'],
  //       },
  //     },
  //   ],
  // },
};
