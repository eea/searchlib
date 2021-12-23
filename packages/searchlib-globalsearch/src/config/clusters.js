import { get_cluster_icons_dict, get_cluster_icons } from '../utils';

export const clusters = {
  name: 'op_cluster',
  field: 'objectProvides',
  clusters: [
    {
      name: 'News',
      icon: { name: 'bullhorn' },
      values: ['News', 'Article'],
      defaultResultView: 'horizontalCard',
    },
    {
      name: 'Publications',
      icon: { name: 'book' },
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
      icon: { name: 'chart area' },
      values: [
        'Figure (chart/map)',
        'Chart (interactive)',
        'Infographic',
        'Data set',
        'Dashboard',
        'Map (interactive)',
      ],
      defaultResultView: 'card',
    },
    {
      name: 'Data',
      icon: { name: 'database' },
      values: ['External data reference', 'Data set'],
      defaultResultView: 'horizontalCard',
    },
    {
      name: 'Others',
      icon: { name: 'copy outline' },
      values: [
        'Webpage',
        'Organisation',
        'FAQ',
        'Video',
        'Contract opportunity',
        'Glossary term',
        'Collection',
        'File',
        'Adaptation option',
        'Guidance',
        'Research and knowledge project',
        'Information portal',
        'Tool',
      ], // this will be transformed in "single type clusters".
      defaultResultView: 'horizontalCard',
    },
  ],
};

// Add "Others", a menu with subgroups.

export const clusterIcons = get_cluster_icons(clusters);

export default {
  icons: {
    'Content types': get_cluster_icons_dict(clusters),
    Sources: {
      fallback: {
        url: require('../static/website-logo.png'),
      },
      'EEA Website (www.eea.europa.eu)': {
        url: require('../static/eea-logo.png'),
      },
      'BISE (biodiversity.europa.eu)': {
        url: require('../static/bise-logo.png'),
      },
      'WISE Marine (water.europa.eu/marine)': {
        url: require('../static/wise-logo.png'),
      },
      'Energy (climate-energy.eea.europa.eu)': {
        url: require('../static/energy-logo.png'),
      },
      'WISE Freshwater (water.europa.eu/freshwater)': {
        url: require('../static/water-logo.png'),
      },
      'FISE (forest.eea.europa.eu)': {
        url: require('../static/forest-logo.png'),
      },
      'Industry (industry.eea.europa.eu)': {
        url: require('../static/industry-logo.png'),
      },
      'Climate-adapt (climate-adapt.eea.europa.eu)': {
        url: require('../static/climate-adapt-logo.png'),
      },
      'Eionet (eionet.europa.eu)': {
        url: require('../static/eionet-logo.png'),
      },
    },
    Countries: {
      fallback: {
        country: 'placeholder',
      },
    },
  },

  contentSectionsParams: {
    // This enables the content as section tabs
    enable: true,
    sectionFacetsField: 'op_cluster',
    sections: clusters.clusters,
    clusterMapping: Object.assign(
      {},
      ...clusters.clusters.map(({ name, values }) =>
        Object.assign({}, ...values.map((v) => ({ [v]: name }))),
      ),
    ),
  },
};
