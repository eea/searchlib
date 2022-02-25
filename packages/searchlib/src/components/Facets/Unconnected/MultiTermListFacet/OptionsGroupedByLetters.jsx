import { Button } from 'semantic-ui-react'; // , Header, Divider
import { Icon, Term } from '@eeacms/search/components';

import { getFilterValueDisplay } from './utils';

const OptionsGroupedByLetters = ({
  groupedOptionsByLetters,
  onRemove,
  onSelect,
  iconsFamily,
  field,
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
        {groupedOptionsByLetters[letter].map((option, i) => {
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
              <span className="count">{option.count.toLocaleString('en')}</span>
            </Button>
          );
        })}
      </div>
    </div>
  ));

export default OptionsGroupedByLetters;
