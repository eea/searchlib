const http = require('http');

const superagent = require('superagent');

const esProxyWhitelist = {
  GET: ['/es/*'],
  POST: ['/es/*'],
  //POST: ['^/_search', /^\/[\w\d.-]+\/_search/],
};

function filterRequests(req) {
  const tomatch = esProxyWhitelist[req.method] || [];
  const matches = tomatch.filter((m) => req.url.match(m)).length;
  return matches > 0;
}

function lengthInBytes(str) {
  var specialCharacters = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (specialCharacters ? specialCharacters.length : 0);
}

export const createESMiddleware = (config) => {
  return async function (req, res, next) {
    if (filterRequests(req)) {
      console.log("here");
      const url = '<URL>';
      const body = '';
      const resp = await superagent
        .post(url)
        .send(body)
        .set('accept', 'application/json');
      return resp;
    } else {
      next();
    }
  };
};

//import { createProxyMiddleware } from 'http-proxy-middleware';
/*const esProxyWhitelist = {
  GET: [
    '^/_aliases',
    '^/_all',
    ...(process.env.RAZZLE_ES_INDEX
      ? [`^/${process.env.RAZZLE_ES_INDEX}/_search`]
      : []),
  ],
  POST: ['^/_search', /^\/[\w\d.-]+\/_search/],
};*/

/*function filterRequests(pathname, req) {
  const tomatch = esProxyWhitelist[req.method] || [];
  const matches = tomatch.filter((m) => pathname.match(m)).length;
  return matches > 0;
}*/

/*const target =
  process.env.RAZZLE_ELASTIC_URL ||
  process.env.ELASTIC_URL ||
  'http://localhost:9200';

const esproxy = createProxyMiddleware(filterRequests, {
  target,
  logLevel: 'debug',
});
esproxy.id = 'esproxy'*/
