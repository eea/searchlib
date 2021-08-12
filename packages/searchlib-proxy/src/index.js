import express from 'express';
import { createESMiddleware } from '@eeacms/search-middleware';

import installConfig from './config';
import { registry } from '@eeacms/search';

const localRegistry = installConfig(registry);

// TODO: may need to do applyConfigurationSchema
const appConfig =
  localRegistry.searchui[process.env.RAZZLE_APP_NAME || 'standalone'];

const es_proxy = createESMiddleware({
  es: process.env.PROXY_ES_DSN || 'http://localhost:9200/_all',
  qa: process.env.PROXY_QA_DSN || 'http://localhost:8000/api/qa/query',
  appConfig,
});

const server = express()
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .use(express.urlencoded())
  .use(express.json())
  .use([es_proxy]);

export default server;
