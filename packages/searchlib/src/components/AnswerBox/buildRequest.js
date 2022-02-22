import { buildRequestFilter } from '@eeacms/search/lib/search/query/filters';
import { filterNLPConfig } from './utils';
import { extractExactPhrases } from '@eeacms/search/lib/search/query/fullText';

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
    ...(config.debugQuery ? { explain: true } : {}),
    params: {
      use_dp: config.nlp.qa.use_dp || false,
      config: filterNLPConfig(config),
      DensePassageRetriever: {
        top_k: parseInt(config.nlp.qa.topk_retriever || 10),
        index: config.nlp.qa.dpr_index,
      },
      RawRetriever: {
        top_k: parseInt(config.nlp.qa.topk_retriever || 10),
        index: config.nlp.qa.raw_index,
      },
      AnswerExtraction: {
        top_k: parseInt(config.nlp.qa.topk_reader || 10),
      },
      custom_query: {
        // Dynamic values based on current Search UI state
        function_score: {
          functions: config?.extraQueryParams?.functions,
          score_mode: config?.extraQueryParams?.score_mode,
          query: {
            bool: {
              ...(config?.extraQAQueryFilters || {}),
              must: [
                {
                  multi_match: {
                    // eslint-disable-next-line
                    query: question,
                    minimum_should_match: '75%',
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
    // ...(sort && { sort }),
    // ...(size && { size }),
    // ...(from && { from }),
    // isQuestion: true,
  };

  const { phrases } = extractExactPhrases(searchTerm);
  phrases.forEach((phrase) =>
    body.params.custom_query.function_score.query.bool.must.push({
      match_phrase: { all_fields_for_freetext: phrase },
    }),
  );

  return body;
};

export const buildSimilarityRequest = ({ base, candidates }, config) => {
  const body = {
    requestType: 'nlp',
    endpoint: config.nlp.similarity.servicePath,
    base,
    candidates,
  };
  return body;
};

export const buildSpacyRequest = ({ texts }, config) => {
  const body = {
    requestType: 'nlp',
    endpoint: config.nlp.spacy.servicePath,
    texts,
  };
  return body;
};
