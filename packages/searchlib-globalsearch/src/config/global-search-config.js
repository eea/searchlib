import { build_runtime_mappings } from '../utils';
import clusterParams, { clusters } from './clusters';

import facets from './facets';
import views from './views';
import query from './query';
import filters from './filters';
import download from './download';

const globalSearchConfig = {
  title: 'Global search and catalogue',
  layoutComponent: 'FilterAsideLayout',
  contentBodyComponent: 'FilterAsideContentView',
  enableNLP: true, // enables NLP capabilities
  facetsListComponent: 'VerticalCardsModalFacets',
  runtime_mappings: build_runtime_mappings(clusters),
  useSearchPhrases: false,
  searchAsYouType: false,

  ...facets,
  ...views,
  ...query,
  ...filters,
  ...download,
  ...clusterParams,

  highlight: {
    queryParams: {
      fragment_size: 200,
      number_of_fragments: 3,
    },
    fields: ['description'],
    queryBuilder: {
      factory: 'highlightQueryBuilder',
    },
  },

  sortOptions: [
    {
      name: 'Title a-z',
      value: 'title',
      direction: 'asc',
    },
    {
      name: 'Title z-a',
      value: 'title',
      direction: 'desc',
    },
    {
      name: 'Oldest',
      value: 'issued.date',
      direction: 'asc',
    },
    {
      name: 'Newest',
      value: 'issued.date',
      direction: 'desc',
    },
  ],
};

export default globalSearchConfig;
