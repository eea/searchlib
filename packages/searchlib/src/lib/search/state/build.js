import buildStateFacets from './facets';

/*
  Converts an Elasticsearch response to new application state

  When implementing an onSearch Handler in Search UI, the handler needs to
  convert search results into a new application state that Search UI
  understands.

  For instance, Elasticsearch returns "hits" for search results. This maps to
  the "results" property in application state, which requires a specific
  format. So this file iterates through "hits" and reformats them to "results"
  that Search UI understands.

  We do similar things for facets and totals.
*/
export default function buildState(response, resultsPerPage, config) {
  const results = buildResults(response.hits.hits, config.field_filters);
  const totalResults = buildTotalResults(response.hits);
  const totalPages = buildTotalPages(resultsPerPage, totalResults);
  const facets = buildStateFacets(response.aggregations, config);

  // console.log('response', results);

  return {
    results,
    totalPages,
    totalResults,
    ...(facets && { facets }),
  };
}

function buildTotalPages(resultsPerPage, totalResults) {
  if (!resultsPerPage) return 0;
  if (totalResults === 0) return 1;
  return Math.ceil(totalResults / resultsPerPage);
}

function buildTotalResults(hits) {
  return hits.total.value;
}

function getHighlight(hit, fieldName) {
  // if (hit._source.title === 'Rocky Mountain' && fieldName === 'title') {
  //   window.hit = hit;
  //   window.fieldName = fieldName;
  // }

  if (
    !hit.highlight ||
    !hit.highlight[fieldName] ||
    hit.highlight[fieldName].length < 1
  ) {
    return;
  }

  return hit.highlight[fieldName][0];
}

function buildResults(hits, field_filters) {
  const addEachKeyValueToObject = (acc, [key, value]) => ({
    ...acc,
    [key]: value,
  });

  const toObject = (field, value, snippet) => {
    const bl = field_filters[field]?.blacklist || [];
    const wl = field_filters[field]?.whitelist || [];
    if (!Array.isArray(value)) {
      value = [value];
    }
    let filtered_value = value.filter((val) => bl.indexOf(val) === -1);
    if (wl.length > 0) {
      filtered_value = filtered_value.filter((val) => wl.indexOf(val) !== -1);
    }
    if (filtered_value.length === 1) {
      filtered_value = filtered_value[0];
    }
    return { raw: filtered_value, ...(snippet && { snippet }) };
  };

  return hits.map((record) => {
    const rec = Object.entries(record._source)
      .map(([fieldName, fieldValue]) => [
        fieldName,
        toObject(fieldName, fieldValue, getHighlight(record, fieldName)),
      ])
      .reduce(addEachKeyValueToObject, {});

    if (!Object.keys(rec).includes('id')) {
      rec.id = { raw: record._id }; // TODO: make sure to have ids
    }
    rec._original = record;
    return rec;
  });
}
