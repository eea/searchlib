import React from 'react';

const OptionsGroupedByLetters = ({
  groupedOptionsByLetters,
  onRemove,
  onSelect,
  iconsFamily,
  field,
  OptionButton,
}) =>
  groupedOptionsByLetters.letters.map((letter, index) => (
    <div className="by-groups" key={letter}>
      <div
        className={`group-heading ${index === 0 ? 'first' : ''}`}
        key={letter + 'h'}
      >
        <span>{letter}</span>
      </div>
      <div className="group-content" key={letter + 'c'}>
        {groupedOptionsByLetters[letter].map((option, i) => (
          <OptionButton
            option={option}
            checked={option.selected}
            iconsFamily={iconsFamily}
            field={field}
            onRemove={onRemove}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  ));

export default OptionsGroupedByLetters;

/*
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
            */
