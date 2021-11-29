import { suiFacet, mergeConfig } from '@eeacms/search';
import { getGlobalsearchThumbUrl, getGlobalsearchIconUrl } from './../utils';
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

  // config.resolve.LandingPage = { component: LandingPage };

  config.searchui.minimal = mergeConfig(config.searchui.default, envConfig);
  config.searchui.minimal.facets = [
    suiFacet({ field: 'Sector' }),
    suiFacet({
      field: 'Origin_of_the_measure',
      label: 'Origin of the measure',
    }),
  ];

  config.searchui.promptQueries = [
    'what is the status of our forests',
    'what is PFAS?',
    'how does PFAS get into human?',
    'what is the cumulative surface area of the Natura 2000?',
    'what percentage of europe population is connected to waste water treatement?',
    'How is the status of fish species in Europe?',
    'What is the BISE?',
    'how much does transport contributes to GHG emissions in EU?',
    'Which cities in Europe have the worst air quality?',
    'What car is best for the environment?',
    'What transport mode is best for the environment?',
    'What EU legislation safeguards our water?',
    'What is land accounting?',
    'What countries had the highest land take in the EEA-39 between 2000 and 2018?',
    'Why is urban sprawl bad?',
    'what are controlled substances',
    'what is plastic',
    'What year did car manufacturers meet their binding emissions target?',
    'What is the percentage of surface water bodies with less than good status?',
    'What is the most common pollutant in water bodies in Europe?',
    'Where can I access greenhouse gas data',
    'What is the trend on greenhouse gas emissions from transport',
    'what is the best transport mode',
    'what are ecosystem services',
    'bathing water quality',
    'greenhouse gas emissions trends',
    'waste generation trends',
  ];

  return config;
}
