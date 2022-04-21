import facets from './facets';
import views from './views';
import filters from './filters';

const datahubConfig = {
  title: 'Datahub',

  ...facets,
  ...views,
  ...filters,
};

export default datahubConfig;
