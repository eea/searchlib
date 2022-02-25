import React from 'react';

import { Icon, Term } from '@eeacms/search/components';
import { Button } from 'semantic-ui-react'; // , Header, Divider

import OptionsGroupedByLetters from './OptionsGroupedByLetters';
import OptionsGroupedByNumbers from './OptionsGroupedByNumbers';
import SortedOptions from './SortedOptions';
import { getFilterValueDisplay } from './utils';

const FacetOptions = (props) => {
  const {
    sortedOptions,
    groupedOptionsByLetters,
    groupedOptionsByNumbers,
    sorting,
    onSelect,
    onRemove,
    iconsFamily,
    field,
    availableOptions,
  } = props;

  const sortedOptionKeys = sortedOptions.map((o) => o.value);
  const zeroValueOptions = (availableOptions || [])
    .filter((name) => !sortedOptionKeys.includes(name))
    .map((name) => ({ value: name, count: 0, selected: false }));

  let isGroupedByLetters = false;
  if (Object.keys(groupedOptionsByLetters).length > 0) {
    if (
      groupedOptionsByLetters.letters.length >= 5 &&
      sortedOptions.length >= 100
    ) {
      // Apply grouping by letters only if we have at least 5 groups and
      // at least 100 options.
      isGroupedByLetters = true;
    }
  }

  let isGroupedByNumbers = false;
  if (Object.keys(groupedOptionsByNumbers).length > 0) {
    if (
      groupedOptionsByNumbers.numbers.length >= 3 &&
      sortedOptions.length >= 50
    ) {
      // Apply grouping by numbers only if we have at least 5 groups and
      // at least 50 options.
      isGroupedByNumbers = true;
    }
  }

  const OptionButton = React.useMemo(
    () => ({ option, checked, iconsFamily, field, onRemove, onSelect }) => (
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
        <span className="count">{option.count.toLocaleString('en')}</span>
      </Button>
    ),
    [],
  );

  const optionProps = {
    sortedOptions,
    groupedOptionsByNumbers,
    groupedOptionsByLetters,
    onRemove,
    onSelect,
    iconsFamily,
    field,
    sorting,
    OptionButton,
  };

  return (
    <div>
      {isGroupedByLetters ? (
        <OptionsGroupedByLetters {...optionProps} />
      ) : isGroupedByNumbers ? (
        <OptionsGroupedByNumbers {...optionProps} />
      ) : (
        <SortedOptions {...optionProps} />
      )}

      {sortedOptions.length < 1 && <div>No matching options</div>}

      {zeroValueOptions.map((option, index) => (
        <Button
          key={`${getFilterValueDisplay(option.value)}`}
          className="term"
          toggle
          active={false}
          disabled
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
          <span className="count">{option.count.toLocaleString('en')}</span>
        </Button>
      ))}
    </div>
  );
};

export default FacetOptions;
