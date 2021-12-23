import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'semantic-ui-react';

import cx from 'classnames';

function PagingPrevNext({
  className,
  end,
  searchTerm,
  start,
  totalResults,
  ...rest
}) {
  return (
    <div className={cx('sui-paging-info', className)} {...rest}>
      {start > 1 ? (
        <Button className="prev" compact color="green" size="mini">
          back
        </Button>
      ) : null}
      Results {start} - {end} of {totalResults}{' '}
      {end < totalResults ? (
        <Button className="next" compact color="green" size="mini">
          next
        </Button>
      ) : null}
    </div>
  );
}

PagingPrevNext.propTypes = {
  end: PropTypes.number.isRequired,
  searchTerm: PropTypes.string.isRequired,
  start: PropTypes.number.isRequired,
  totalResults: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default PagingPrevNext;
