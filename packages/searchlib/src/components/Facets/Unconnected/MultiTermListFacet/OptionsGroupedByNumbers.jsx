import React from 'react';
import { Button } from 'semantic-ui-react'; // , Header, Divider
import { Icon, Term } from '@eeacms/search/components';

import { getFilterValueDisplay } from './utils';

const OptionsGroupedByNumbers = ({
  groupedOptionsByNumbers,
  sorting,
  onRemove,
  onSelect,
  iconsFamily,
  field,
}) =>
  groupedOptionsByNumbers.numbers.map((number, index) => {
    let label = '';
    let nextLimit = 0;
    if (sorting.sortOrder === 'descending') {
      if (index === 0) {
        label = `More than ${number}`;
      } else {
        nextLimit = groupedOptionsByNumbers.numbers[index - 1];
        label = `${number}...${nextLimit}`;
      }
    } else {
      nextLimit = groupedOptionsByNumbers.numbers[index + 1];
      if (nextLimit === undefined) {
        label = `More than ${number}`;
      } else {
        label = `${number}...${nextLimit}`;
      }
    }
    return (
      <div className="by-groups" key={number}>
        <div
          className={`group-heading ${index === 0 ? 'first' : ''}`}
          key={number + 'h'}
        >
          <span>{label}</span>
        </div>
        <div className="group-content" key={number + 'c'}>
          {groupedOptionsByNumbers[number].map((option, i) => {
            const checked = option.selected;
            return (
              <Button
                key={`${getFilterValueDisplay(option.value)}`}
                className="term"
                toggle
                active={checked}
                onClick={() =>
                  checked ? onRemove(option.value) : onSelect(option.value)
                }
              >
                {iconsFamily && (
                  <Icon
                    family={iconsFamily}
                    type={option.value}
                    className="facet-option-icon"
                  />
                )}
                <span className="title">
                  <Term term={option.value} field={field} />
                </span>
                <span className="count">
                  {option.count.toLocaleString('en')}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    );
  });

export default OptionsGroupedByNumbers;
