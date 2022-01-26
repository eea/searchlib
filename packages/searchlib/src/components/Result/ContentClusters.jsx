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

  return Object.entries(displayClusters).map(
    ([clusterName, cluster], index) => {
      // protect against async cluster information not filled in yet
      return Object.keys(cluster).length ? (
        <span key={index}>
          <span className="cluster-icon">
            <Icon {...cluster.icon} />
          </span>
          <span className="tags">
            <StringList value={clusterName} />
            {clusterName !== cluster.content_types?.[0] && (
              <>
                <Icon name="angle right" />
                <StringList
                  value={displayClusters[clusterName].content_types}
                />
              </>
            )}
          </span>
        </span>
      ) : null;
    },
  );
};
export default ContentClusters;