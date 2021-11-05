import { get_cluster_icons, get_icons } from '../utils';

export const clusters = {
  name: 'op_cluster',
  field: 'objectProvides',
  clusters: [
    {
      name: 'Visualizations',
      icon: 'chart area',
      values: ['EEAFigure', 'DavizVisualization', 'Infographic', 'Dashboard'],
    },
    {
      name: 'News',
      icon: 'newspaper outline',
      values: ['News', 'Report', 'Article'],
    },
    {
      name: 'Data',
      icon: 'table',
      values: ['ExternalDataSpec', 'Data'],
    },
  ],
};

export const clusterIcons = get_cluster_icons(clusters);

export default {
  contentUtilsParams: {
    clusterIcons,
  },

  contentSectionsParams: {
    // This enables the content as section tabs
    enable: true,
    sectionFacetsField: 'op_cluster',

    icons: get_icons(clusters),
  },
};
