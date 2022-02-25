import { Button } from 'semantic-ui-react'; // , Header, Divider
import { Icon, Term } from '@eeacms/search/components';

import { getFilterValueDisplay } from './utils';

const SortedOptions = ({
  sortedOptions,
  onRemove,
  onSelect,
  iconsFamily,
  field,
}) =>
  sortedOptions.map((option) => {
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
  });

export default SortedOptions;
