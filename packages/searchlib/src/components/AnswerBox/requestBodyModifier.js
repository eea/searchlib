export default function addQAParams(body, config) {
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
    },
    AnswerExtraction: {
      top_k: parseInt(config.nlp.qa.topk_reader || 10),
    },
    AnswerOptimizer: {
      cutoff: parseFloat(config.nlp.qa.cutoffScore ?? 0.1),
    },
  };

  return body;
}
