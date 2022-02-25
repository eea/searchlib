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
      name: 'Maps and charts',
      icon: { name: 'chart area' },
      values: [
        'Figure (chart/map)',
        'Chart (interactive)',
        'Infographic',
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
        'Case study',
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
      eea: {
        url: require('../static/eea-logo.png'),
      },
      ias: {
        url: require('../static/ias-logo.png'),
      },
      bise: {
        url: require('../static/bise-logo.png'),
      },
      'wise-marine': {
        url: require('../static/wise-logo.png'),
      },
      energy: {
        url: require('../static/energy-logo.png'),
      },
      'wise-freshwater': {
        url: require('../static/water-logo.png'),
      },
      fise: {
        url: require('../static/forest-logo.png'),
      },
      industry: {
        url: require('../static/industry-logo.png'),
      },
      cca: {
        url: require('../static/climate-adapt-logo.png'),
      },
      etc: {
        url: require('../static/eionet-logo.png'),
      },
      'etc-atni': {
        url: require('../static/etc-atni.png'),
      },

      'etc-bd': {
        url: require('../static/etc-bd.jpg'),
      },

      'etc-cca': {
        url: require('../static/etc-cca.jpeg'),
      },

      'etc-cme': {
        url: require('../static/etc-cme.png'),
      },

      'etc-icm': {
        url: require('../static/etc-icm.jpg'),
      },

      'etc-uls': {
        url: require('../static/etc-uls.png'),
      },

      'etc-wmge': {
        url: require('../static/etc-wmge.png'),
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

export function typesForClustersOptionsFilter(options, filters) {
  // Only display content types that belong to the currently selected cluster
  const clusterMap = Object.assign(
    {},
    ...clusters.clusters.map(({ name, values }) =>
      Object.assign({}, ...values.map((v) => ({ [v]: name }))),
    ),
  );

  const clusterFilter = filters?.find((f) => f.field === 'op_cluster');
  const activeCluster = clusterFilter?.values?.[0];

  return activeCluster
    ? options.filter((f) => clusterMap[f.value] === activeCluster)
    : options;
}
