import { get_cluster_icons, get_icons } from '../utils';

export const clusters = {
  name: 'op_cluster',
  field: 'objectProvides',
  clusters: [
    {
      name: 'News',
      icon: 'bullhorn',
      values: ['News', 'Article'],
      defaultResultView: 'table',
    },
    {
      name: 'Publications',
      icon: 'book',
      values: ['Report', 'Indicator', 'Briefing', 'Topic page', 'Country fact sheet'],
      defaultResultView: 'table',
    },
    {
      name: 'Visualizations',
      icon: 'chart area',
      values: ['Figure (chart/map)', 'Chart (interactive)', 'Infographic', 'Data dashboard', 'Map (interactive)'],
      defaultResultView: 'card',
    },
    {
      name: 'Data',
      icon: 'database',
      values: ['External data reference', 'Data set'],
      defaultResultView: 'table',
    },
    {
      name: 'Others',
      icon: 'copy outline',
      values: ['Webpage', 'Organisation', 'FAQ', 'Video', 'Contract opportunity', 'Glossary term'],// this will be transformed in "single type clusters".
      defaultResultView: 'card',
    },
  ],
};

// Add "Others", a menu with subgroups.

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
