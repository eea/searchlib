export default {
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
};
