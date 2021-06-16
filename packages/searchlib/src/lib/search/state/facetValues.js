import { indexOf } from 'lodash';

export function getValueFacet(aggregations, fieldName, whitelist, blacklist) {
  const bl = blacklist || [];
  if (aggregations?.[fieldName]?.buckets?.length > 0) {
    const unfiltered_data = aggregations[fieldName].buckets.map((bucket) => ({
      // Boolean values and date values require using `key_as_string`
      value: bucket.key_as_string || bucket.key,
      count: bucket.doc_count,
    }));
    let filtered_data = unfiltered_data.filter(
      (bucket) => bl.indexOf(bucket.value) === -1,
    );
    if (whitelist) {
      filtered_data = filtered_data.filter(
        (bucket) => whitelist.indexOf(bucket.value) !== -1,
      );
    }
    return [
      {
        field: fieldName,
        type: 'value',
        data: filtered_data,
      },
    ];
  }
}

export function getRangeFacet(aggregations, fieldName) {
  if (aggregations?.[fieldName]?.buckets?.length > 0) {
    return [
      {
        field: fieldName,
        type: 'range',
        data: aggregations[fieldName].buckets.map((bucket) => ({
          // Boolean values and date values require using `key_as_string`
          value: {
            to: bucket.to,
            from: bucket.from,
            name: bucket.key,
          },
          count: bucket.doc_count,
        })),
      },
    ];
  }
}
