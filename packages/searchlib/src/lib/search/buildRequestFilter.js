function getTermFilterValue(field, fieldValue) {
  // We do this because if the value is a boolean value, we need to apply
  // our filter differently. We're also only storing the string representation
  // of the boolean value, so we need to convert it to a Boolean.

  // TODO We need better approach for boolean values
  if (fieldValue === 'false' || fieldValue === 'true') {
    return { [field]: fieldValue === 'true' };
  }

  return { [`${field}`]: fieldValue };
}

function getTermFilter(filter) {
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

function getRangeFilter(filter) {
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

export default function buildRequestFilter(filters) {
  if (!filters) return;

  // TODO: extract filters from facets
  filters = filters.reduce((acc, filter) => {
    if (
      [
        'Country',
        'Sector',
        'Use_or_activity',
        'Status',
        'Origin_of_the_measure',
        'Nature_of_the_measure',
        'Water_body_category',
        'Spatial_scope',
        'Measure_Impacts_to',
        'Descriptors',
      ].includes(filter.field)
    ) {
      return [...acc, getTermFilter(filter)];
    }

    // if (['acres', 'visitors'].includes(filter.field)) {
    //   return [...acc, getRangeFilter(filter)];
    // }

    return acc;
  }, []);

  if (filters.length < 1) return;
  return filters;
}
