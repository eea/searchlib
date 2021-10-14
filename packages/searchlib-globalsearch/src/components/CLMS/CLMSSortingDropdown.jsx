import React from 'react';

import { Dropdown } from 'semantic-ui-react';

const SortingView = (props) => {
  const { options, onChange, value } = props;
  // console.log('props: ', props);
  return (
    <div class="ccl-form">
      <div>
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <>
              <div class="ccl-form-group">
                <input
                  type="checkbox"
                  id={option.value + '_sort'}
                  name="field_gdpr[value]"
                  value={option.value}
                  className="ccl-checkbox ccl-required ccl-form-check-input"
                  data-enpassusermodified="yes"
                  checked={checked}
                  onChange={() => {
                    onChange(option.value);
                  }}
                />
                <label
                  className="ccl-form-check-label"
                  for={option.value + '_sort'}
                >
                  {option.label}
                </label>
              </div>
            </>
          );
        })}
        {options.length < 1 && <div>No matching options</div>}
      </div>
    </div>
  );
};

export default SortingView;
