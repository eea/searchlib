import React from 'react';
import PagingPrevNext from './../PagingInfo/PagingPrevNext';
import { PagingInfo as SUIPagingInfo } from '@elastic/react-search-ui';
import { Button, Icon } from 'semantic-ui-react';
import { useSearchContext } from '@eeacms/search/lib/hocs';

function Paging({ className, resultsPerPage, onChange, ...rest }) {
  const searchContext = useSearchContext();
  const { current, setCurrent, totalPages } = searchContext;

  const goToNext = () => {
    setCurrent(current + 1);
  };

  const goToPrev = () => {
    setCurrent(current - 1);
  };

  return (
    <>
      <div className="wip">
        {current > 1 ? (
          <Button
            onClick={() => goToPrev()}
            className="prev"
            compact
            color="green"
            size="mini"
          >
            <Icon name="angle double left" />
            back
          </Button>
        ) : null}
        <SUIPagingInfo view={PagingPrevNext} />
        {current < totalPages ? (
          <Button
            onClick={() => goToNext()}
            className="next"
            compact
            color="green"
            size="mini"
          >
            next
            <Icon name="angle double right" />
          </Button>
        ) : null}
      </div>
    </>
  );
}

export default Paging;
