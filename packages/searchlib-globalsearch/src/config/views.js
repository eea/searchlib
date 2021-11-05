import { clusterIcons } from './clusters';

export default {
  resultViews: [
    {
      id: 'horizontalCard',
      title: 'Horizontal cards',
      icon: 'bars',
      render: null,
      isDefault: true,
      factories: {
        view: 'HorizontalCard.Group',
        item: 'HorizontalCardItem',
      },
    },
    {
      id: 'card',
      title: 'Cards',
      icon: 'th',
      render: null,
      isDefault: false,
      factories: {
        view: 'Card.Group',
        item: 'CardItem',
      },
    },
  ],
  cardViewParams: {
    urlField: 'about',
    titleField: 'title',
    metatypeField: 'objectProvides',
    descriptionField: 'description',
    tagsField: 'topic',
    issuedField: 'issued',
    enabled: true,
    getThumbnailUrl: 'getGlobalsearchThumbUrl',
    getIconUrl: 'getGlobalsearchIconUrl',
    clusterIcons,
  },

  horizontalCardViewParams: {
    urlField: 'about',
    titleField: 'title',
    metatypeField: 'objectProvides',
    descriptionField: 'description',
    tagsField: 'topic',
    issuedField: 'issued',
    enabled: true,
    getThumbnailUrl: 'getGlobalsearchThumbUrl',
    getIconUrl: 'getGlobalsearchIconUrl',
    clusterIcons,
  },

  initialView: {
    factory: 'TilesLandingPage',
    tilesLandingPageParams: {
      maxPerSection: 30,
      clusterIcons,
      sections: [
        {
          id: 'topics',
          title: 'Topics',
          facetField: 'topic',
        },
        {
          id: 'countries',
          title: 'Countries',
          facetField: 'spatial',
        },
        {
          id: 'types',
          title: 'Types',
          facetField: 'objectProvides',
        },
        {
          id: 'language',
          title: 'Languages',
          facetField: 'language',
        },
      ],
    },
  },

  listingViewParams: {
    enabled: false,
  },

  tableViewParams: {
    titleField: 'title',
    urlField: 'about',
    enabled: true,
    columns: [
      {
        title: 'Title',
        field: 'title',
      },
      {
        title: 'Description',
        field: 'description',
      },
      {
        title: 'Countries',
        field: 'spatial',
      },
      {
        title: 'Regions / Places / Cities / Seas...',
        field: 'places',
      },
      {
        title: 'Content types',
        field: 'objectProvides',
      },
      {
        title: 'Topics',
        field: 'topic',
      },
      {
        title: 'Issued',
        field: 'issued',
      },
      {
        title: 'Time coverage',
        field: 'time_coverage',
      },
      {
        title: 'Format',
        field: 'format',
      },
    ],
  },
};
