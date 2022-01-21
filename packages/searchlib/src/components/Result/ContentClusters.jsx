import React from 'react';
import { Icon, StringList } from '@eeacms/search/components';
import { useSearchContext } from '@eeacms/search/lib/hocs';

const ContentClusters = ({ clusters }) => {
  const context = useSearchContext();
  const clusterFilter = context.filters?.find((f) => f.field === 'op_cluster');
  const activeCluster = clusterFilter?.values?.[0];
  const displayClusters = activeCluster
    ? { [activeCluster]: { ...clusters[activeCluster] } }
    : clusters;

  return Object.keys(displayClusters).map((cluster, index) => (
    <span key={index}>
      <span className="cluster-icon">
        <Icon {...clusters[cluster].icon} />
      </span>
      <span className="tags">
        <StringList value={cluster} />
        {(clusters[cluster].content_types.length === 1 &&
          cluster === clusters[cluster].content_types[0]) || (
          <>
            <Icon name="angle right" />
            <StringList value={clusters[cluster].content_types} />
          </>
        )}
      </span>
    </span>
  ));
};
export default ContentClusters;
