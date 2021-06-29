export const buildMLTFilter =
  (condition = 'like') =>
  (filter, config) => {
    return {
      more_like_this: {
        fields: config.filters.moreLikeThis.fields, // 'all_fields_for_freetext'
        [condition]: [
          {
            _id: filter.values[0],
          },
        ],
        min_term_freq: 1,
        max_query_terms: 12,
      },
    };
  };
