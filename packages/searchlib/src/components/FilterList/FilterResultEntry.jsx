import React from 'react';
import { Icon } from 'semantic-ui-react';
import { useAtom } from 'jotai';
import { moreLikeThisAtom } from '@eeacms/search/state';
import { DateTime, StringList } from '@eeacms/search/components';

const FilterResultEntry = (props) => {
  const { value } = props;
  const [result] = useAtom(moreLikeThisAtom);

  if (result) {
    return (
      <div class="mlt-card">
        <a href={result.about.raw} target="_blank" rel="noreferrer">
          <Icon name="external" size="small" />
          {result.title.raw}
        </a>
        <p>
          <DateTime format="DATE_MED" value={result.issued.raw} />
          &nbsp;|&nbsp;
          <StringList value={result.subject.raw} />
        </p>
        <p>{result.description.raw}</p>
      </div>
    );
  }
  return value;
};

export default FilterResultEntry;
