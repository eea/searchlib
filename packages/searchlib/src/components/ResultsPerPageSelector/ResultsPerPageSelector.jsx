import React from 'react';
import { Dropdown, Icon } from 'semantic-ui-react';
import { useSearchContext } from '@eeacms/search/lib/hocs';

const ResultsPerPageSelector = (props) => {
  // const { views, active, onSetView } = props;

  const defaultProps = [20, 40, 60];

  const options = defaultProps.map((item) => ({
    key: item,
    text: <> {item} </>,
    value: item,
  }));

  const searchContext = useSearchContext();
  const { resultsPerPage, setResultsPerPage } = searchContext;

  return (
    <div className="view-selector">
      <span>
        <Dropdown
          text={`${resultsPerPage} results/page`}
          key={resultsPerPage}
          inline
          options={options}
          defaultValue={resultsPerPage}
          onChange={(e, { value }) => {
            searchContext.setResultsPerPage(value);
          }}
        />
        <Icon name="dropdown" />
      </span>
    </div>
  );
};

export default ResultsPerPageSelector;
