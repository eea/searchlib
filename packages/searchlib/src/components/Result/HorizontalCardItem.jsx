import React from 'react';
import cx from 'classnames';
import { useAtom } from 'jotai';
import { Image, Label, Button } from 'semantic-ui-react';

import { Icon, DateTime, StringList } from '@eeacms/search/components';
import { moreLikeThisAtom, showFacetsAsideAtom } from '@eeacms/search/state';
import ResultContext from './ResultContext';
import { SegmentedBreadcrumb } from '@eeacms/search/components';
import { useSearchContext } from '@eeacms/search/lib/hocs';

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

const CardItem = (props) => {
  const { result, showControls = true } = props;
  const context = useSearchContext();
  const { setFilter, removeFilter, setSearchTerm } = context;

  const [, setMoreLikeThis] = useAtom(moreLikeThisAtom);
  const [, setOpenFacets] = useAtom(showFacetsAsideAtom);

  const [hovered, setHovered] = React.useState(false);

  let metaType = result.metaTypes || '';
  if (metaType.length === 0) {
    metaType = 'Others';
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
            <Icon {...result.clusterIcon} />
          </span>
          <span className="tags">
            <StringList value={result.clusterName} />
            {metaType !== result.clusterName && (
              <>
                <Icon name="angle right" />
                <StringList value={metaType} />
              </>
            )}
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
          <p className="tags">
            <StringList value={result.tags} />
          </p>
          {props.children ? props.children : <ResultContext {...props} />}
          <p className="source">
            <span>Source: </span>
            <ExternalLink href={result.href}>
              {result.source}
              <SegmentedBreadcrumb href={result.href} short={true} />
            </ExternalLink>

            {showControls && (
              <Button
                className="mlt"
                compact
                color="green"
                size="mini"
                onClick={() => {
                  removeFilter('lessLikeThis');
                  setSearchTerm('');
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
};

export default CardItem;
