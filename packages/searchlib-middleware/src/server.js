import express from 'express';
import { createESMiddleware } from './elasticsearch';

// import installConfig from './config';
// import { registry } from '@eeacms/search';
//
// const localRegistry = installConfig(registry);
//
// // TODO: may need to do applyConfigurationSchema
// const appConfig =
//   localRegistry.searchui[process.env.RAZZLE_APP_NAME || 'standalone'];

const makeServer = (appConfig) => {
  const es_proxy = createESMiddleware({
    es: process.env.PROXY_ES_DSN || 'http://localhost:9200/_all',
    qa: process.env.PROXY_QA_DSN || 'http://localhost:8000/api/qa/query',
    appConfig,
  });
  const server = express()
    .disable('x-powered-by')
    // .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
    .use(express.urlencoded())
    .use(express.json())
    .use([es_proxy]);
  return server;
};

export default makeServer;
