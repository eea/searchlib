import React from 'react';
import cx from 'classnames';
import { Dropdown } from 'semantic-ui-react';

function getFilterValueDisplay(filterValue) {
  if (filterValue === undefined || filterValue === null) return '';
  if (filterValue.hasOwnProperty('name')) return filterValue.name;
  return String(filterValue);
}

const ViewComponent = (props) => {
  const { className, label, onRemove, onSelect, options } = props;
  // console.log('options', props);
  return <div>Date range facet here</div>;

  const value = (props.values?.[0] || props.default?.values?.[0])?.name;

  console.log('hello');

  // TODO: fix classname

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
          options={options.map(({ value, config }) => ({
            text: getFilterValueDisplay(value),
            value: config?.key || getFilterValueDisplay(value),
          }))}
          value={value}
          onChange={(e, opt) => {
            onRemove(value);
            onSelect(opt.value);
          }}
        />
      </span>
    </div>
  );
};

export default ViewComponent;
