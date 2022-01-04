import PropTypes from 'prop-types';
import React from 'react';
// import RCPagination from 'rc-pagination';
import enUsLocale from 'rc-pagination/lib/locale/en_US';

import { appendClassName } from '@elastic/react-search-ui-views/lib/view-helpers';
import PagingPrevNext from './../PagingInfo/PagingPrevNext';
import { PagingInfo as SUIPagingInfo } from '@elastic/react-search-ui';
import { Button, Icon } from 'semantic-ui-react';
import {
  useSearchContext,
  useAppConfig,
  useViews,
} from '@eeacms/search/lib/hocs';

function Paging({ className, resultsPerPage, onChange, ...rest }) {
  const searchContext = useSearchContext();
  const { current, setCurrent, totalPages } = searchContext;

  console.log(searchContext);

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
      <SUIPagingInfo view={PagingPrevNext} />
    </>
  );
  // return (
  //   <RCPagination
  //     current={current}
  //     onChange={onChange}
  //     pageSize={resultsPerPage}
  //     total={totalPages * resultsPerPage}
  //     className={appendClassName('sui-paging', className)}
  //     locale={enUsLocale}
  //     {...rest}
  //   />
  // );
}

// Paging.propTypes = {
//   current: PropTypes.number.isRequired,
//   onChange: PropTypes.func.isRequired,
//   resultsPerPage: PropTypes.number.isRequired,
//   totalPages: PropTypes.number.isRequired,
//   className: PropTypes.string,
// };

export default Paging;
