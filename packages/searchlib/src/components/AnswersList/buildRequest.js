import { buildRequestFilter } from '@eeacms/search/lib/search/query/filters';

export const buildClassifyQuestionRequest = (state, appConfig) => {
  const { searchTerm } = state;

  let query = searchTerm;
  if (query.indexOf('|') > -1) {
    query = query.split('|').filter((p) => !!p.trim());
  }
  if (Array.isArray(query)) {
    query = query.join(' ');
  }

  return {
    requestType: 'nlp',
    endpoint: appConfig.nlp.classifyQuestion.servicePath,
    query,
  };
};

export const buildQuestionRequest = (state, config) => {
  const {
    searchTerm,
    filters,
    // current,
    // resultsPerPage,
    // sortDirection,
    // sortField,
  } = state;

  let question = searchTerm;
  if (question.indexOf('|') > -1) {
    question = question.split('|').filter((p) => !!p.trim());
  }
  if (Array.isArray(question)) {
    question = question.join(' ');
  }

  const filter = buildRequestFilter(filters, config);

  const body = {
    requestType: 'nlp',
    endpoint: config.nlp.qa.servicePath,
    query: question,
    track_total_hits: false,
    params: {
      use_dp: true,
      custom_query: {
        query: {
          // Dynamic values based on current Search UI state
          function_score: {
            query: {
              bool: {
                must: [
                  {
                    multi_match: {
                      // eslint-disable-next-line
                  query: '${query}',
                      fields: [
                        // TODO: use in the above query
                        ...(config.extraQueryParams?.text_fields || [
                          'all_fields_for_freetext',
                        ]),
                      ],
                    },
                  },
                ],
                ...(filter && { filter }),
              },
            },
            // functions: [...(config.extraQueryParams?.functions || [])],
            // score_mode: config.extraQueryParams?.score_mode || 'sum',
          },
        },
      },
    },
    // ...(sort && { sort }),
    // ...(size && { size }),
    // ...(from && { from }),
    // isQuestion: true,
  };

  return body;
};