import React from 'react';
import { useSearchContext } from '@eeacms/search/lib/hocs';
import { getDidYouMeanTerms } from '@eeacms/search/lib/search/autocomplete/suggestions';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { Button } from 'semantic-ui-react';

const getSuggestions = async (term, config) => {
  const suggestions = await getDidYouMeanTerms({ searchTerm: term }, config);
  return suggestions.join(' ');
};
export const NoResults = (props) => {
  const { resultSearchTerm, setSearchTerm } = useSearchContext();
  const { appConfig } = useAppConfig();
  const [suggestions, setSuggestions] = React.useState();

  React.useEffect(() => {
    if (resultSearchTerm.trim().length > 0) {
      getSuggestions(resultSearchTerm, appConfig).then((rsp) => {
        setSuggestions(rsp.replace(/[^a-zA-Z ]/g, ' ').trim());
      });
    }
  });

  const applyQuery = React.useCallback(
    (text) => {
      setSearchTerm(text, { shouldClearFilters: false });
    },
    [setSearchTerm],
  );

  return (
    <>
      {resultSearchTerm.trim().length > 0 && (
        <>
          <h3>
            We could not find any results for '<b>{resultSearchTerm.trim()}</b>'
          </h3>
          <p>
            <span>Try instead: </span>
            <Button
              as="a"
              className="suggestions-button"
              basic
              onClick={(evt) => {
                evt.preventDefault();
                applyQuery(suggestions);
              }}
            >
              {suggestions}
            </Button>
          </p>
          <ul>
            <li>check your spelling</li>
            <li>enter fewer words</li>
            <li>check the selected filters</li>
          </ul>
        </>
      )}
      {resultSearchTerm.trim().length === 0 && (
        <>
          <h3>We could not find any results for your search criteria</h3>
          <ul>
            <li>check the selected filters</li>
          </ul>
        </>
      )}
    </>
  );
};
