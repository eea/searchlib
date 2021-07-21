const esProxyWhitelist = {
  GET: ['/es/_search'],
  POST: ['/es/_search'],
};
function filterRequests(req) {
  const tomatch = esProxyWhitelist[req.method] || [];
  const matches = tomatch.filter((m) => req.url.match(m)).length;
  return matches > 0;
}


export const createESMiddleware = (config) => {
  const superagent = require('superagent');
  const {user, pwd, host, port, index} = config;
  const url = `http://${user}:${pwd}@${host}:${port}/${index}/_search`;
  return function (req, res, next) {
    if (filterRequests(req)) {
      const body = req.body;
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