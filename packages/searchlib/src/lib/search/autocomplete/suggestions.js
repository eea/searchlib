import runRequest from '@eeacms/search/lib/runRequest';
import { buildDidYouMeanRequest, buildFaqRequest } from './autocompleteRequest';
import { buildState } from './autocompleteState';

export async function getAutocompleteSuggestions(props, config) {
  // console.log('onAutocomplete', { requestBody, props, config });
  const { searchTerm } = props;
  if (searchTerm.length > 1 && searchTerm[searchTerm.length - 1] === '|') {
    Promise.resolve({});
  }

  const requestBody = buildDidYouMeanRequest(props, config);
  const json = await runRequest(requestBody, config);
  const didYouMeanState = buildState(
    json.body,
    props,
    config,
    config.autocomplete.include_searchterm,
    true,
  );

  const faqRequestBody = buildFaqRequest(props, config);
  const faqJson = await runRequest(faqRequestBody, config);
  const faqState = buildState(faqJson.body, props, config, false, true);

  return {
    didYouMean: didYouMeanState.state,
    faq: faqState.state,
  };
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
