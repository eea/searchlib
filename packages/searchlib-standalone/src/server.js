import App from './App';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { createESMiddleware } from '@eeacms/search-middleware';

import installConfig from './config';
import { registry } from '@eeacms/search';

const localRegistry = installConfig(registry);

// TODO: may need to do applyConfigurationSchema
const appConfig =
  localRegistry.searchui[process.env.RAZZLE_APP_NAME || 'standalone'];

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const cssLinksFromAssets = (assets, entrypoint) => {
  return assets[entrypoint]
    ? assets[entrypoint].css
      ? assets[entrypoint].css
          .map((asset) => `<link rel="stylesheet" href="${asset}">`)
          .join('')
      : ''
    : '';
};

const jsScriptTagsFromAssets = (assets, entrypoint, extra = '') => {
  return assets[entrypoint]
    ? assets[entrypoint].js
      ? assets[entrypoint].js
          .map((asset) => `<script src="${asset}"${extra}></script>`)
          .join('')
      : ''
    : '';
};

const es_proxy = createESMiddleware({
  es: process.env.PROXY_ES_DSN || 'http://localhost:9200/_all',
  qa: process.env.PROXY_QA_DSN || 'http://localhost:8000/api/qa/query',
  appConfig,
});

const hostname = process.env.HOSTNAME;

const server = express()
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .use(express.urlencoded())
  .use(express.json())
  .use([es_proxy])
  .get('/*', (req, res) => {
    const context = {};
    const markup = renderToString(
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>,
    );

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(
        `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Search</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${cssLinksFromAssets(assets, 'client')}
    </head>
    <body>
        <script> var runtimeConfig = {HOSTNAME: '${hostname}'};</script>
        <div id="root">${markup}</div>
        ${jsScriptTagsFromAssets(assets, 'client', ' defer crossorigin')}
    </body>
</html>`,
      );
    }
  });

export default server;
