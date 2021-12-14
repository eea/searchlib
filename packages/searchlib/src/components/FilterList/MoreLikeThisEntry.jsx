/**
 * This is the display card for the "More like this" selection
 */

import React from 'react';
import { useAtom } from 'jotai';
import { moreLikeThisAtom } from '@eeacms/search/state';
import { DateTime, StringList, Icon } from '@eeacms/search/components';
import { ExternalLink } from '@eeacms/search/components/Result/HorizontalCardItem';
import { Image } from 'semantic-ui-react';
import { useResult } from '@eeacms/search/lib/hocs';

const MoreLikeThisEntry = (props) => {
  const { value } = props;
  const [result] = useAtom(moreLikeThisAtom);
  const item = useResult(result, value);

  return item ? (
    <div className="mlt-filter ui fluid card facet active">
      <div className="mlt-card content">
        <div className="header">More like this</div>
        <Image
          className="img-thumbnail"
          src={item.thumbUrl}
          wrapped
          ui={false}
          fluid
          centered
          style={{ backgroundImage: `url('${item.thumbUrl}')` }}
          as={ExternalLink}
          href={item.href}
          target="_blank"
          rel="noreferrer"
        />
        <h4>
          <a href={item.href} target="_blank" rel="noreferrer">
            <Icon name="external" size="small" />
            {item.title}
          </a>
        </h4>
        <div className="meta">
          <DateTime format="DATE_MED" value={item.issued} />
          &nbsp;
          <Icon family="Content types" type={item.metaTypes} />
          <StringList value={item.metaTypes} />
        </div>
      </div>
    </div>
  ) : (
    ''
  );
};

export default MoreLikeThisEntry;
