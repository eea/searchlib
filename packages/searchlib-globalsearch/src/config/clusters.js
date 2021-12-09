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
      Sources: {
        type: 'images',
        fallback: 'website-logo.png',
        'EEA Website (www.eea.europa.eu)': 'eea-logo.png',
        'BISE (biodiversity.europa.eu)': 'bise-logo.png',
        'WISE Marine (water.europa.eu/marine)': 'wise-logo.png',
        'Energy (climate-energy.eea.europa.eu)': 'energy-logo.png',
        'WISE Freshwater (water.europa.eu/freshwater)': 'water-logo.png',
        'FISE (forest.eea.europa.eu)': 'forest-logo.png',
        'Industry (industry.eea.europa.eu)': 'industry-logo.png',
        'Climate-adapt (climate-adapt.eea.europa.eu)': 'climate-adapt-logo.png',
        'Eionet (eionet.europa.eu)': 'eionet-logo.png',
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
