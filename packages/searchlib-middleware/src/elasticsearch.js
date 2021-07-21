// import { createProxyMiddleware } from 'http-proxy-middleware';
// const esProxyWhitelist = {
//   GET: [
//     '^/_aliases',
//     '^/_all',
//     ...(process.env.RAZZLE_ES_INDEX
//       ? [`^/${process.env.RAZZLE_ES_INDEX}/_search`]
//       : []),
//   ],
//   POST: ['^/_search', /^\/[\w\d.-]+\/_search/],
// };
//
// function filterRequests(pathname, req) {
//   const tomatch = esProxyWhitelist[req.method] || [];
//   const matches = tomatch.filter((m) => pathname.match(m)).length;
//   console.log('filterRequest', pathname, matches);
//   return matches > 0;
// }
//
// const target =
//   process.env.RAZZLE_ELASTIC_URL ||
//   process.env.ELASTIC_URL ||
//   'http://localhost:9200';
//
// export const createESMiddleware = (config) => {
//   const esproxy = createProxyMiddleware(filterRequests, {
//     target,
//     logLevel: 'debug',
//   });
//   esproxy.id = 'esproxy';
//   return esproxy;
// };

// const http = require('http');

// import superagent from 'superagent'
const esProxyWhitelist = {
  GET: ['/es/_search'],
  POST: ['/es/_search'],
  //POST: ['^/_search', /^\/[\w\d.-]+\/_search/],
};
function filterRequests(req) {
  const tomatch = esProxyWhitelist[req.method] || [];
  const matches = tomatch.filter((m) => req.url.match(m)).length;
  return matches > 0;
}

// function lengthInBytes(str) {
//   var specialCharacters = encodeURIComponent(str).match(/%[89ABab]/g);
//   return str.length + (specialCharacters ? specialCharacters.length : 0);
// }

export const createESMiddleware = (config) => {
  const superagent = require('superagent');

  return function (req, res, next) {
    if (filterRequests(req)) {
      const url = 'http://localhost:9200/global-search_prod/_search';
      const body = req.body;
      // console.log('middleware', superagent);
      // console.log('here', req.body);
      superagent.post(url)
        .send(body)
        .set('accept', 'application/json')
        .end((err, resp) => {
          res.send(resp.body)
        });

    } else {
      next();
    }
  };
};