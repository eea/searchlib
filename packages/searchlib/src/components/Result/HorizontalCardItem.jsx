import React from 'react';
import cx from 'classnames';
import { useAtom } from 'jotai';
import { Icon, Image, Label, Button } from 'semantic-ui-react';
import { withSearch } from '@elastic/react-search-ui';

import { DateTime, StringList } from '@eeacms/search/components';
import { moreLikeThisAtom, showFacetsAsideAtom } from '@eeacms/search/state';
import ResultContext from './ResultContext';

export const ExternalLink = (props) => {
  return (
    <a
      className={props.className}
      href={props.href}
      target="_blank"
      rel="noreferrer"
      style={props.style}
    >
      {props.children}
    </a>
  );
};

const CardItemComponent = withSearch(({ setFilter, removeFilter }) => ({
  setFilter,
  removeFilter,
}))((props) => {
  const { result, setFilter, removeFilter, showControls = true } = props;

  const [, setMoreLikeThis] = useAtom(moreLikeThisAtom);
  const [, setOpenFacets] = useAtom(showFacetsAsideAtom);

  const [hovered, setHovered] = React.useState(false);

  let metaType = result.metaTypes || '';
  if (metaType.length === 0) {
    metaType = ['Other'];
  }

  return (
    <div
      className={cx('search-result', { hovered })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="col-full">
        <div className="meta">
          <span className="date">
            <DateTime format="DATE_MED" value={result.issued} />
          </span>
          <span className="cluster-icon">
            <Icon name={result.clusterIcon} />
          </span>
          <span className="tags">
            <StringList value={metaType} />
          </span>
        </div>
      </div>
      <div className="col-left">
        <div className="details">
          <h3>
            <ExternalLink href={result.href}>{result.title}</ExternalLink>
            {result.isNew && (
              <Label className="new-item" horizontal>
                New
              </Label>
            )}
            {result.isExpired && (
              <Label className="archived-item" horizontal>
                Archived
              </Label>
            )}
          </h3>
          {props.children ? props.children : <ResultContext {...props} />}
          <p className="source">
            <span>Source: </span>
            <ExternalLink href={result.href}>{result.website}</ExternalLink>

            {showControls && (
              <Button
                className="mlt"
                compact
                color="green"
                size="mini"
                onClick={() => {
                  removeFilter('lessLikeThis');
                  setMoreLikeThis(result);
                  setFilter('moreLikeThis', result._original._id, 'none');
                  setOpenFacets(true);
                }}
              >
                more like this
              </Button>
            )}
          </p>
        </div>
      </div>
      <div className="col-right">
        <Image
          className="img-thumbnail"
          src={result.thumbUrl}
          wrapped
          ui={false}
          fluid
          centered
          as={ExternalLink}
          href={result.href}
          target="_blank"
          rel="noreferrer"
        />
      </div>
    </div>
  );
});

const CardItem = (props) => <CardItemComponent {...props} />;

export default CardItem;
