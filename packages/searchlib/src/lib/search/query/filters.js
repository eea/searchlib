/**
 * Construct the ES DSL query for a filter or facet
 *
 */
export function getTermFilterValue(field, fieldValue) {
  // We do this because if the value is a boolean value, we need to apply
  // our filter differently. We're also only storing the string representation
  // of the boolean value, so we need to convert it to a Boolean.

  // TODO We need better approach for boolean values
  if (fieldValue === 'false' || fieldValue === 'true') {
    return { [field]: fieldValue === 'true' };
  }

  return { [`${field}`]: fieldValue };
}

export function getTermFilter(filter) {
  // Construct ES DSL query for term facets

  if (filter.type === 'any') {
    return {
      bool: {
        should: filter.values.map((filterValue) => ({
          term: getTermFilterValue(filter.field, filterValue),
        })),
        minimum_should_match: 1,
      },
    };
  } else if (filter.type === 'all') {
    return {
      bool: {
        filter: filter.values.map((filterValue) => ({
          term: getTermFilterValue(filter.field, filterValue),
        })),
      },
    };
  }
}

export function getRangeFilter(filter) {
  // Construct ES DSL query for range facets

  if (filter.type === 'any') {
    return {
      bool: {
        should: filter.values.map((filterValue) => ({
          range: {
            [filter.field]: {
              ...(filterValue.to && { lt: filterValue.to }),
              ...(filterValue.to && { gt: filterValue.from }),
            },
          },
        })),
        minimum_should_match: 1,
      },
    };
  } else if (filter.type === 'all') {
    return {
      bool: {
        filter: filter.values.map((filterValue) => ({
          range: {
            [filter.field]: {
              ...(filterValue.to && { lt: filterValue.to }),
              ...(filterValue.to && { gt: filterValue.from }),
            },
          },
        })),
      },
    };
  }
}

export function getHistogramFilter(filter) {
  console.log('histogram filter', filter);
  return {};

  // qs['aggs'][fobj['field']] = { range: { field: fobj['field'] } };
  // for (var facet_cnt = 0; facet_cnt < options.facets.length; facet_cnt++) {
  //   if (options.facets[facet_cnt].field === fobj['field']) {
  //     if (
  //       options.facets[facet_cnt].histogram_config.aggs_script !== undefined
  //     ) {
  //       delete qs['aggs'][fobj['field']]['range'].field;
  //       qs['aggs'][fobj['field']]['range'].script =
  //         options.facets[facet_cnt].histogram_config.aggs_script;
  //     }
  //     qs['aggs'][fobj['field']]['range'].ranges =
  //       options.facets[facet_cnt].histogram_config.ranges;
  //   }
  // }
}
