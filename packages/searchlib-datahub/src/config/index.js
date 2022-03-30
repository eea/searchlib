import datahubSearchConfig from './datahub-search-config';
import { mergeConfig } from '@eeacms/search';

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
    : datahubSearchConfig;

  const pjson = require('../../package.json');
  envConfig.app_name = pjson.name;
  envConfig.app_version = pjson.version;

  config.searchui.datahub = {
    ...mergeConfig(envConfig, config.searchui.globalsearch),
    elastic_index: 'es',
    host: process.env.RAZZLE_ES_PROXY_ADDR || 'http://localhost:3000',
  };

  if (typeof window !== 'undefined') {
    config.searchui.datahub.host =
      process.env.RAZZLE_ES_PROXY_ADDR || getClientProxyAddress();
  }

  return config;
}
