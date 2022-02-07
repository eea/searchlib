export function buildDidYouMeanRequest({ searchTerm }, config) {
  const phrases = searchTerm.split('|');
  let search_term = phrases[phrases.length - 1];

  let previous_search_term;

  // const correct_search_term = search_term;
  //
  // if (correct_search_term) {
  //   search_term = correct_search_term.join(' ');
  // }

  const current_parts = search_term.split(' ').filter(function (value) {
    return value.length !== 0;
  });

  let last_modified_word = search_term;
  if (previous_search_term !== '') {
    last_modified_word = current_parts[current_parts.length - 1];
  }

  previous_search_term = search_term;

  const query = {
    size: 0,
    aggs: {
      autocomplete_full: {
        terms: {
          field: 'autocomplete',
          order: {
            _count: 'desc',
          },
          include: search_term + '.*',
        },
      },
      autocomplete_last: {
        terms: {
          field: 'autocomplete',
          order: {
            _count: 'desc',
          },
          include: last_modified_word + '.*',
        },
      },
    },
    query: {
      bool: {
        must: [], // TODO: predefined_filters
      },
    },
    ...(config.enableNLP && {
      ...config.requestParams,
    }),
  };

  return query;
}

export function buildFaqRequest({ searchTerm }, config) {
  const phrases = searchTerm.split('|');
  let search_term = phrases[phrases.length - 1];

  // const correct_search_term = search_term;
  //
  // if (correct_search_term) {
  //   search_term = correct_search_term.join(' ');
  // }

  const query = {
    size: 0,
    aggs: {
      autocomplete_full: {
        terms: {
          field: 'title.index',
        },
      },
    },
    query: {
      bool: {
        must: [
          {
            multi_match: {
              query: search_term,
              fields: 'title',
              minimum_should_match: '80%',
            },
          },
          {
            match: {
              objectProvides: 'FAQ',
            },
          },
          {
            match: {
              language: 'en',
            },
          },
        ],
      },
    },
    ...(config.enableNLP && {
      ...config.requestParams,
    }),
  };
  return query;
}
