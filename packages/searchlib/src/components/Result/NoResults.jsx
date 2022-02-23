import React from 'react';
import { useSearchContext } from '@eeacms/search/lib/hocs';

export const NoResults = (props) => {
  const { resultSearchTerm } = useSearchContext();
  return (
    <>
      {resultSearchTerm.trim().length > 0 && (
        <>
          <h3>
            We could not find any results for '<b>{resultSearchTerm}</b>'
          </h3>
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
