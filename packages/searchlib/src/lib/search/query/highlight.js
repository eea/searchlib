const _highlight = (searchTerm, fieldName) => {
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
  return searchTerm && config.highlight?.fields
    ? {
        highlight: {
          ...config.highlight,
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
