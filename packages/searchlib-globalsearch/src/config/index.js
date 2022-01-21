import { suiFacet, mergeConfig } from '@eeacms/search';
import { getGlobalsearchThumbUrl, getGlobalsearchIconUrl } from './../utils';
import { typesForClustersOptionsFilter } from './clusters';

// import WebsiteFilterListComponent from './../components/WebsiteFilterListComponent';

import contentTypeNormalize from './json/contentTypeNormalize.json';
import globalSearchConfig from './global-search-config.js';

const getClientProxyAddress = () => {
  const url = new URL(window.location);
  url.pathname = '';
  url.search = '';
  return url.toString();
};

export default function install(config) {
  // console.log(process.env.RAZZLE_ENV_CONFIG);
  const envConfig = process.env.RAZZLE_ENV_CONFIG
    ? JSON.parse(process.env.RAZZLE_ENV_CONFIG)
    : globalSearchConfig;

  const pjson = require('../../package.json');
  envConfig.app_name = pjson.name;
  envConfig.app_version = pjson.version;

  config.searchui.globalsearch = {
    ...mergeConfig(envConfig, config.searchui.default),
    elastic_index: 'es',
    host: process.env.RAZZLE_ES_PROXY_ADDR || 'http://localhost:3000',
  };

  if (typeof window !== 'undefined') {
    config.searchui.globalsearch.host =
      process.env.RAZZLE_ES_PROXY_ADDR || getClientProxyAddress();
  }

  config.searchui.standalone = {
    ...mergeConfig(envConfig, config.searchui.default),
    host: process.env.RAZZLE_ES_PROXY_ADDR,
    elastic_index: 'es',
    facets: [],
    highlight: {},
    sortOptions: [],
    tableViewParams: {
      columns: [
        {
          title: 'Title',
          field: 'title',
        },
      ],
    },
    listingViewParams: {
      titleField: 'title',
      extraFields: [],
      details: {
        titleField: 'title',
        extraFields: [],
      },
      sections: [],
    },
  };

  config.resolve.getGlobalsearchIconUrl = getGlobalsearchIconUrl(
    contentTypeNormalize,
  );
  config.resolve.getGlobalsearchThumbUrl = getGlobalsearchThumbUrl(
    contentTypeNormalize,
  );

  config.resolve.typesForClustersOptionsFilter = typesForClustersOptionsFilter;
  // config.resolve.WebsiteFilterListComponent = {
  //   component: WebsiteFilterListComponent,
  // };
  // config.resolve.FreshnessRangeFacet = {
  //   ...config.resolve.FixedRangeFacet,
  //   component: (props) => <div>Mumu</div>,
  // };

  // config.resolve.LandingPage = { component: LandingPage };

  config.searchui.minimal = mergeConfig(config.searchui.default, envConfig);
  config.searchui.minimal.facets = [
    suiFacet({ field: 'Sector' }),
    suiFacet({
      field: 'Origin_of_the_measure',
      label: 'Origin of the measure',
    }),
  ];

  return config;
}
