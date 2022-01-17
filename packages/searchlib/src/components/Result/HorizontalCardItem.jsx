import React from 'react';
import cx from 'classnames';
import { useAtom } from 'jotai';
import { Label, Button, Dropdown } from 'semantic-ui-react';

import {
  Icon,
  DateTime,
  StringList,
  TagsList,
} from '@eeacms/search/components';
import { moreLikeThisAtom, showFacetsAsideAtom } from '@eeacms/search/state';
import ResultContext from './ResultContext';
import { SegmentedBreadcrumb } from '@eeacms/search/components';
import { useWindowDimensions, useSearchContext } from '@eeacms/search/lib/hocs';
import { firstWords } from './utils';

export const ExternalLink = (props) => {
  return (
    <a
      className={props.className}
      href={props.href}
      target="_blank"
      rel="noreferrer"
      style={props.style}
      title={props.title}
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

  // console.log('result', result.metaTypes, result._result);

  let metaType = result.metaTypes || '';
  if (metaType.length === 0) {
    metaType = 'Others';
  }

  const classColLeft = result.hasImage ? 'col-left' : 'col-left no-image';

  const { width } = useWindowDimensions();
  const isSmallScreen = width < 1000;
  const clusters = result.clusterInfo;
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
          {Object.keys(clusters).map((cluster, index) => (
            <span key={index}>
              <span className="cluster-icon">
                <Icon {...clusters[cluster].icon} />
              </span>
              <span className="tags">
                <StringList value={cluster} />
                <Icon name="angle right" />
                <StringList value={clusters[cluster].content_types} />
              </span>
            </span>
          ))}

          <span className="tags-list">
            <TagsList value={result.tags} />
          </span>
        </div>
      </div>
      <div className={classColLeft}>
        <div className="details">
          <h3>
            <ExternalLink href={result.href} title={result.title}>
              {firstWords(result.title, 12)}
            </ExternalLink>
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
          <div className="source">
            <span>Source: </span>
            <ExternalLink href={result.href}>
              <span title={result.source} className="source">
                {firstWords(result.source, 3)}
              </span>
              <SegmentedBreadcrumb
                href={result.href}
                short={true}
                maxChars={40}
              />
            </ExternalLink>

            {showControls && !isSmallScreen && (
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
            {showControls && isSmallScreen && (
              <Dropdown icon="ellipsis vertical">
                <Dropdown.Menu className="mlt">
                  <Dropdown.Item
                    onClick={() => {
                      removeFilter('lessLikeThis');
                      setMoreLikeThis(result);
                      setFilter('moreLikeThis', result._original._id, 'none');
                    }}
                  >
                    More like this
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
          {props.children ? props.children : <ResultContext {...props} />}
        </div>
      </div>
      {
        result.hasImage ? (
          <div className="col-right">
            <a
              className={`centered fluid image img-thumbnail`}
              href={result.href}
              target="_blank"
              rel="noreferrer"
            >
              <img
                alt={result.href}
                src={result.thumbUrl}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </a>
          </div>
        ) : null
      }
    </div >
  );
};

export default CardItem;
