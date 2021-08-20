import express from 'express';
import { createESMiddleware } from './elasticsearch';
import cors from 'cors';

const makeServer = (appConfig) => {
  const es_proxy = createESMiddleware({
    es: process.env.PROXY_ES_DSN || 'http://localhost:9200/_all',
    qa: process.env.PROXY_QA_DSN || 'http://localhost:8000/api/qa/query',
    appConfig,
  });
  const server = express()
    .disable('x-powered-by')
    .options('*', cors())
    .use(cors({ origin: '*' }))

    // .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
    .use(express.urlencoded())
    .use(express.json())
    .use([es_proxy]);
  return server;
};

export default makeServer;

/** Here's how a minimal server.js may look like:
 *
import runtime from 'regenerator-runtime/runtime'; // compatibility with react-speech-recognition

import { registry } from '@eeacms/search';
import { makeServer } from '@eeacms/search-middleware';
import installConfig from './config';

console.log('runtime', runtime);
const configRegistry = installConfig(registry);

const app = makeServer(configRegistry.searchui.wise);
const port = process.env.PORT || '7000';

app.listen(port, () => {
  console.log(`ES Proxy app running on http://localhost:${port}`);
});

*/
