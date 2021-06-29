export const buildMLTFilter = (filter, config) => {
  return {
    more_like_this: {
      fields: ['title', 'text'], // 'all_fields_for_freetext'
      like: [
        {
          _id: filter.values[0],
        },
      ],
      min_term_freq: 1,
      max_query_terms: 12,
    },
  };
};
