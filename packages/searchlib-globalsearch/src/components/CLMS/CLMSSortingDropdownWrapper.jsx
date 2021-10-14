import React from 'react';

import { Dropdown } from 'semantic-ui-react';
import { Sorting, PagingInfo as SUIPagingInfo } from '@elastic/react-search-ui';

const SortingViewWrapper = (props) => {
  const { label, sortOptions, view, onChange } = props;
  let initialIsOpened = false;
  const [isOpened, setIsOpened] = React.useState(initialIsOpened);
  return (
    <nav className="dropdown-filters">
      <fieldset className="ccl-fieldset">
        <div
          className="ccl-expandable__button"
          aria-expanded={isOpened}
          onClick={() => setIsOpened(!isOpened)}
          onKeyDown={() => setIsOpened(!isOpened)}
          tabIndex="0"
          role="button"
        >
          <legend class="ccl-form-legend">{label || 'Sort by'}</legend>

          {/* <Dropdown
          selection
          floating
          options={options.map(({ label, value }) => ({ text: label, value }))}
          onChange={(e, { value }) => {
            onChange(value);
          }}
        /> */}
        </div>
        <Sorting
          label={label}
          sortOptions={sortOptions}
          view={props.view}
        />
      </fieldset>
    </nav>
  );
};

export default SortingViewWrapper;
