import runRequest from '@eeacms/search/lib/runRequest';

import React from 'react';

const clean = (text) =>
  text
    .split(' ')
    .filter(function (value) {
      return value.length !== 0;
    })
    .join(' ');

export function buildState(data, { searchTerm }, config) {
  console.log('hits', data);

  const buckets_full = data.aggregations.autocomplete_full.buckets || [];
  const buckets_last = data.aggregations.autocomplete_last.buckets || [];

  const { autocomplete: settings = {} } = config;

  const search_term = searchTerm;

  const hints = buckets_full
    .map((h) => clean(h.key))
    .filter((h) => h !== search_term);

  buckets_last.forEach(({ key }) => {
    if (!hints.includes(key) && key !== search_term) {
      hints.push(clean(key));
    }
  });

  // const current_parts = [];
  // for (var i = 0; i < buckets_last.length; i++) {
  //   if (buckets_last[i].key.split(' ').length < 3) {
  //     current_parts[current_parts.length - 1] = buckets_last[i].key;
  //     hint = current_parts.join(' ');
  //     if (!hints.includes(hint) && hint !== search_term) {
  //       hints.push(clean(hint));
  //     }
  //   }
  // }

  // Add search term as first item in array
  if (settings.include_searchterm) {
    hints.unshift(search_term);
    hints.pop();
  }

  return {
    didYouMean: hints.map((term) => ({
      suggestion: term,
      highlight: `${term} -> <strong>${term}</strong>`,
      data: null,
    })),
  };
}

export async function getAutocompleteSuggestions(props, config) {
  // console.log('onAutocomplete', { requestBody, props, config });

  const requestBody = buildRequest(props, config);
  const json = await runRequest(requestBody, config);

  return buildState(json.body, props, config);
}

export function buildRequest({ searchTerm }, config) {
  let search_term = searchTerm,
    previous_search_term;

  // const correct_search_term = search_term;
  //
  // if (correct_search_term) {
  //   search_term = correct_search_term.join(' ');
  // }

  const current_parts = search_term.split(' ').filter(function (value) {
    return value.length !== 0;
  });

  let last_modified_word = search_term;
  if (previous_search_term !== '') {
    last_modified_word = current_parts[current_parts.length - 1];
  }

  previous_search_term = search_term;

  const query = {
    size: 0,
    aggs: {
      autocomplete_full: {
        terms: {
          field: 'autocomplete',
          order: {
            _count: 'desc',
          },
          include: search_term + '.*',
        },
      },
      autocomplete_last: {
        terms: {
          field: 'autocomplete',
          order: {
            _count: 'desc',
          },
          include: last_modified_word + '.*',
        },
      },
    },
    query: {
      bool: {
        must: [], // predefined_filters
      },
    },
  };

  return query;
}

// const x = {
//   size: 0,
//   aggs: {
//     autocomplete_full: {
//       terms: {
//         field: 'autocomplete',
//         order: {
//           _count: 'desc',
//         },
//         include: 'europe.*',
//       },
//     },
//     autocomplete_last: {
//       terms: {
//         field: 'autocomplete',
//         order: {
//           _count: 'desc',
//         },
//         include: 'europe.*',
//       },
//     },
//   },
//   query: {
//     bool: {
//       must: [
//         {
//           term: {
//             hasWorkflowState: 'published',
//           },
//         },
//         {
//           constant_score: {
//             filter: {
//               bool: {
//                 should: [
//                   {
//                     bool: {
//                       must_not: {
//                         exists: {
//                           field: 'issued',
//                         },
//                       },
//                     },
//                   },
//                   {
//                     range: {
//                       'issued.date': {
//                         lte: '2021-06-16T15:43:34Z',
//                       },
//                     },
//                   },
//                 ],
//               },
//             },
//           },
//         },
//         {
//           constant_score: {
//             filter: {
//               bool: {
//                 should: [
//                   {
//                     bool: {
//                       must_not: {
//                         exists: {
//                           field: 'expires',
//                         },
//                       },
//                     },
//                   },
//                   {
//                     range: {
//                       expires: {
//                         gte: '2021-06-16T15:43:34Z',
//                       },
//                     },
//                   },
//                 ],
//               },
//             },
//           },
//         },
//       ],
//     },
//   },
// };
