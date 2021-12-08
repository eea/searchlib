import { get_cluster_icons, get_cluster_icons_dict, get_icons } from '../utils';

export const clusters = {
  name: 'op_cluster',
  field: 'objectProvides',
  clusters: [
    {
      name: 'News',
      icon: 'bullhorn',
      values: ['News', 'Article'],
      defaultResultView: 'horizontalCard',
    },
    {
      name: 'Publications',
      icon: 'book',
      values: [
        'Report',
        'Indicator',
        'Briefing',
        'Topic page',
        'Country fact sheet',
      ],
      defaultResultView: 'horizontalCard',
    },
    {
      name: 'Visualizations',
      icon: 'chart area',
      values: [
        'Figure (chart/map)',
        'Chart (interactive)',
        'Infographic',
        'Data dashboard',
        'Dashboard',
        'Map (interactive)',
      ],
      defaultResultView: 'card',
    },
    {
      name: 'Data',
      icon: 'database',
      values: ['External data reference', 'Data set'],
      defaultResultView: 'horizontalCard',
    },
    {
      name: 'Others',
      icon: 'copy outline',
      values: [
        'Webpage',
        'Organisation',
        'FAQ',
        'Video',
        'Contract opportunity',
        'Glossary term',
      ], // this will be transformed in "single type clusters".
      defaultResultView: 'horizontalCard',
    },
  ],
};

// Add "Others", a menu with subgroups.

export const clusterIcons = get_cluster_icons(clusters);
export const clusterIconsDict = get_cluster_icons_dict(clusters);

export default {
  contentUtilsParams: {
    clusterIcons,
    iconsDicts: {
      'Content types': clusterIconsDict,
      Websites: {
        fallback: 'globe',
        'EEA Website (www.eea.europa.eu)': 'globe',
        'BISE (biodiversity.europa.eu)': 'leaf',
        'WISE Marine (water.europa.eu/marine)': 'anchor',
        'Energy (climate-energy.eea.europa.eu)': 'bolt',
        'WISE Freshwater (water.europa.eu/freshwater)': 'tint',
        'FISE (forest.eea.europa.eu)': 'tree',
        'Industry (industry.eea.europa.eu)': 'industry',
      },
    },
  },

  contentSectionsParams: {
    // This enables the content as section tabs
    enable: true,
    sectionFacetsField: 'op_cluster',

    sections: clusters.clusters,
    icons: get_icons(clusters),
  },
};
