import { get_cluster_icons, get_icons } from '../utils';

export const clusters = {
  name: 'op_cluster',
  field: 'objectProvides',
  clusters: [
    {
      name: 'Visualizations',
      icon: 'chart area',
      values: ['EEAFigure', 'DavizVisualization', 'Infographic', 'Dashboard'],
      defaultResultView: 'card',
    },
    {
      name: 'News',
      icon: 'newspaper outline',
      values: ['News', 'Report', 'Article'],
      defaultResultView: 'table',
    },
    {
      name: 'Data',
      icon: 'table',
      values: ['ExternalDataSpec', 'Data'],
      defaultResultView: 'table',
    },
  ],
};

export const clusterIcons = get_cluster_icons(clusters);

export default {
  contentUtilsParams: {
    clusterIcons, // TODO: non-basic objects shouldn't be stored in config
  },

  contentSectionsParams: {
    // This enables the content as section tabs
    enable: true,
    sectionFacetsField: 'op_cluster',

    sections: clusters.clusters,
    icons: get_icons(clusters),
  },
};
