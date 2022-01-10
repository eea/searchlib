import React from 'react';
import cx from 'classnames';
import { Dropdown } from 'semantic-ui-react';

const ViewComponent = (props) => {
  const { className, label, id, field, filters, appConfig } = props;

  const filter = filters.find(
    (f) => (f.id && f.id === id) || f.field === field,
  );
  const filterConfig = appConfig.facets.find(
    (f) => (f.id || f.field) === field,
  );

  const options = filterConfig.ranges.map(({ key, label }) => ({
    text: label || key,
    value: key,
  }));

  const { setFilter, removeFilter } = props;

  let value = (filter?.values || filterConfig['default'].values)?.[0];
  // value = filterConfig.isMulti ? value : value[0];

  // TODO: fix styling
  return (
    <div className={cx(className, 'sorting')}>
      <span>
        <Dropdown
          trigger={
            <>
              {label} <span>{value}</span>
            </>
          }
          inline
          options={options}
          value={value}
          onChange={(e, opt) => {
            removeFilter(field, value, filterConfig.filterType);
            setFilter(field, opt.value, filterConfig.filterType);
          }}
        />
      </span>
    </div>
  );
};

export default ViewComponent;
