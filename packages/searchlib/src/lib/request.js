import {
  applyDisjunctiveFaceting,
  buildRequest,
  buildState,
  getAutocompleteSuggestions,
} from './search';
import { default as runRequest } from './runRequest';

export function onResultClick() {
  /* Not implemented */
}

export function onAutocompleteResultClick() {
  /* Not implemented */
}

export async function onAutocomplete(props) {
  const _config = this;

  console.log('onautocomplete', props);

  return {
    autocompletedSuggestions: await getAutocompleteSuggestions(props, _config),
    autocompletedResults: [],
  };
}

export async function onSearch(state) {
  const _config = this;
  const { resultsPerPage } = state;
  const requestBody = buildRequest(state, _config);
  console.log('onSearch', { requestBody, _config, state });

  // Note that this could be optimized by running all of these requests
  // at the same time. Kept simple here for clarity.
  const responseJson = await runRequest(requestBody, _config);

  const { body } = responseJson;

  const responseJsonWithDisjunctiveFacetCounts = await applyDisjunctiveFaceting(
    body,
    state,
    _config,
  );

  const newState = buildState(
    responseJsonWithDisjunctiveFacetCounts,
    resultsPerPage,
    _config,
  );

  return newState;
}
