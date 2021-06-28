export function buildFullTextMatch(searchTerm, config) {
  if (searchTerm.indexOf('|') > -1) {
    searchTerm = searchTerm.split('|').filter((p) => !!p);
  }
  return searchTerm
    ? Array.isArray(searchTerm)
      ? searchTerm.length > 0
        ? {
            intervals: {
              all_fields_for_freetext: {
                all_of: {
                  ordered: true,
                  intervals: searchTerm.map((phrase) => ({
                    match: {
                      query: phrase,
                      max_gaps: 0,
                      ordered: true,
                    },
                  })),
                },
              },
            },
          }
        : { match_all: {} }
      : {
          multi_match: {
            query: searchTerm,
            fields: [
              // TODO: use in the above query
              ...(config.extraQueryParams?.text_fields || [
                'all_fields_for_freetext',
              ]),
            ],
          },
        }
    : { match_all: {} };
}
