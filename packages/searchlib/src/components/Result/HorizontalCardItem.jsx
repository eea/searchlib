import React from 'react';
import cx from 'classnames';
import { Label, Button, Dropdown } from 'semantic-ui-react';
import { useAppConfig, useWindowDimensions } from '@eeacms/search/lib/hocs';
import { SegmentedBreadcrumb, TagsList } from '@eeacms/search/components';
import { firstWords, getTermDisplayValue } from '@eeacms/search/lib/utils';

import MoreLikeThisTrigger from './MoreLikeThisTrigger';
import ExternalLink from './ExternalLink';
import ResultContext from './ResultContext';
import ContentClusters from './ContentClusters';

const HorizontalCardItem = (props) => {
  const { result, showControls = true } = props;
  const { appConfig } = useAppConfig();
  const { vocab = {}, debugQuery } = appConfig;
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
          <ContentClusters clusters={clusters} item={result} />
          <div className="tags-list">
            <TagsList value={result.tags} />
          </div>
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
              <strong title={result.source} className="source">
                {firstWords(
                  getTermDisplayValue({
                    vocab,
                    field: 'cluster_name',
                    term: result.source,
                  }),
                  8,
                )}
              </strong>
              <SegmentedBreadcrumb
                href={result.href}
                short={true}
                maxChars={40}
              />
            </ExternalLink>

            {showControls && !isSmallScreen && (
              <MoreLikeThisTrigger
                view={Button}
                className="mlt"
                compact
                color="green"
                size="mini"
                result={result}
              >
                more like this
              </MoreLikeThisTrigger>
            )}
            {showControls && isSmallScreen && (
              <Dropdown icon="ellipsis vertical">
                <Dropdown.Menu className="mlt">
                  <MoreLikeThisTrigger result={result} view={Dropdown.Item}>
                    More like this
                  </MoreLikeThisTrigger>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>

          {props.children ? props.children : <ResultContext {...props} />}
        </div>
        {debugQuery && (
          <div>
            <div>Explanation:</div>
            <pre>{JSON.stringify(result.explanation, undefined, 2)}</pre>
          </div>
        )}
      </div>
      {result.hasImage ? (
        <div className="col-right">
          <a
            className={`centered fluid image img-thumbnail`}
            href={result.href}
            target="_blank"
            rel="noreferrer"
          >
            <img
              alt={result.title}
              src={result.thumbUrl}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </a>
        </div>
      ) : null}
    </div>
  );
};

export default HorizontalCardItem;
