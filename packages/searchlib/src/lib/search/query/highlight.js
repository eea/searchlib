import registry from '@eeacms/search/registry';

export const highlightQueryBuilder = (searchTerm, fieldName) => {
  return {
    highlight_query: {
      bool: {
        must: {
          match: {
            [fieldName]: {
              query: searchTerm,
            },
          },
        },
        should: {
          match_phrase: {
            [fieldName]: {
              query: searchTerm,
              slop: 1,
              boost: 10,
            },
          },
        },
      },
    },
  };
};

export const buildHighlight = (searchTerm, config) => {
  if (!searchTerm || !config.highlight) return {};

  const _highlight = registry.resolve[config.highlight.queryBuilder.factory];

  return searchTerm && config.highlight?.fields
    ? {
        highlight: {
          ...config.highlight.queryParams,
          fields: Object.assign(
            {},
            ...config.highlight.fields.map((name) => ({
              [name]: _highlight(searchTerm, name),
            })),
          ),
        },
      }
    : {};
};
