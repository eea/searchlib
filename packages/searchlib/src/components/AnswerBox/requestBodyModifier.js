export default function addQAParams(body, config, { searchTerm = '' }) {
  const { from, size } = body;
  if (!config.enableNLP || (size ?? 0) === 0 || (from ?? 0) !== 0) return body;

  body.params = {
    ...(body.params || {}),

    use_dp: config.nlp.qa.use_dp || false,
    DensePassageRetriever: {
      top_k: parseInt(config.nlp.qa.topk_retriever || 10),
      index: config.nlp.qa.dpr_index,
    },
    RawRetriever: {
      top_k: parseInt(config.nlp.qa.topk_retriever || 10),
      index: config.nlp.qa.raw_index,
      payload: {
        custom_query: searchTerm,
        query: {
          nested: {
            path: 'nlp_500',
            query: {
              bool: {
                must: [
                  {
                    match: {
                      'nlp_500.text': searchTerm,
                    },
                  },
                ],
              },
            },
            inner_hits: {
              highlight: {
                fields: {
                  'nlp_500.text': {},
                },
              },
            },
          },
        },
      },
    },
    AnswerExtraction: {
      top_k: parseInt(config.nlp.qa.topk_reader || 10),
      // query: searchTerm,
    },
    AnswerOptimizer: {
      cutoff: parseFloat(config.nlp.qa.cutoffScore ?? 0.1),
    },
  };

  return body;
}
