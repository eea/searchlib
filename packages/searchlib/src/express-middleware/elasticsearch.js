const http = require('http');
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
  return (req, res, next) => {
    if (filterRequests(req)) {
      const searchData = JSON.stringify(req.body);

      const searchOptions = {
        host: config.host || 'localhost',
        port: config.port || '9200',
        path: config.index + '/_search',
        method: 'POST',
        // auth: config.user + ':' + config.password,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': lengthInBytes(searchData),
        },
      };

      console.log(searchOptions);
      var searchRequest = http.request(searchOptions, (rsp) => {
        res.status(rsp.statusCode);
        res.set(rsp.headers);

        rsp.on('data', function (chunk) {
          res.write(chunk);
        });
        rsp.on('end', function () {
          res.end();
        });
      });
      searchRequest.on('error', function (e) {
        console.log('Error when performing search query', e.message);
        res.status(500).send({ error: e.message });
      });

      searchRequest.write(searchData);
      searchRequest.end();
    } else {
      next();
    }
  };
};
