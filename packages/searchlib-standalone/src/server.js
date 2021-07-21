import App from './App';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { createESMiddleware } from '@eeacms/search-middleware';

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
  host: process.env.PROXY_ELASTIC_HOST || 'localhost',
  port: process.env.PROXY_ELASTIC_PORT || '9200',
  user: process.env.PROXY_ELASTIC_USER,
  pwd: process.env.PROXY_ELASTIC_PASSWORD,
  index: process.env.PROXY_ELASTIC_INDEX,
});

console.log('esproxy', es_proxy);

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
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
        <div id="root">${markup}</div>
        ${jsScriptTagsFromAssets(assets, 'client', ' defer crossorigin')}
    </body>
</html>`,
      );
    }
  });

export default server;
