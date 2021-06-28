import { EXACT_PHRASES } from '@eeacms/search/constants';

export function buildFullTextMatch(searchTerm, filters, config) {
  if (searchTerm.indexOf('|') > -1) {
    searchTerm = searchTerm.split('|').filter((p) => !!p);
  }
  const exactPhraseFilter = filters.find(
    ({ field }) => field === EXACT_PHRASES,
  );
  const isExact = exactPhraseFilter ? exactPhraseFilter.values[0] : false;

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
                      max_gaps: isExact ? 0 : 1,
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
