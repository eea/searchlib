import facets from './facets';
import views from './views';
import filters from './filters';
import vocabs from './vocabulary';

const datahubConfig = {
  title: 'Datahub',

  ...facets,
  ...views,
  ...filters,
  ...vocabs,
};

export default datahubConfig;
