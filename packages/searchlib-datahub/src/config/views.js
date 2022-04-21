export default {
  initialView: {
    factory: 'TilesLandingPage',
    tilesLandingPageParams: {
      maxPerSection: 30,
      sortField: 'issued.date',
      sortDirection: 'desc',
      sections: [
        {
          id: 'rod',
          title: 'Reporting obligations',
          facetField: 'rod',
          sortOn: 'alpha',
        },
        {
          id: 'topics',
          title: 'EEA topics',
          facetField: 'topic',
          sortOn: 'alpha',
        },
      ],
    },
  },
};
