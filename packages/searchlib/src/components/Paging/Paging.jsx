import PropTypes from 'prop-types';
import React from 'react';
// import RCPagination from 'rc-pagination';
import enUsLocale from 'rc-pagination/lib/locale/en_US';

import { appendClassName } from '@elastic/react-search-ui-views/lib/view-helpers';
import PagingPrevNext from './../PagingInfo/PagingPrevNext';
import { PagingInfo as SUIPagingInfo } from '@elastic/react-search-ui';

function Paging({
  className,
  current,
  resultsPerPage,
  onChange,
  totalPages,
  ...rest
}) {
  // console.log(onChange);

  return <SUIPagingInfo view={PagingPrevNext} />;
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

Paging.propTypes = {
  current: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  resultsPerPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default Paging;
