import buildRequest from '@eeacms/search/lib/search/query';
import runRequest from '@eeacms/search/lib/runRequest';

export async function getFacetOptions(config, facetFieldNames) {
  let body = {
    // pass facetFieldNames as we only want the appropriate aggregations
    ...buildRequest({ filters: [] }, config, facetFieldNames),
    size: 0,
  };

  const response = await runRequest(body, config);
  const aggregations = response?.body?.aggregations || {};

  return Object.assign(
    {},
    ...Object.keys(aggregations).map((name) => ({
      [name]: aggregations[name].buckets.map(({ key }) => key),
    })),
  );
}
