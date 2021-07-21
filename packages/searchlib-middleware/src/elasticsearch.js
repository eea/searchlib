const esProxyWhitelist = {
  GET: ['/es/_search'],
  POST: ['/es/_search'],
};
function filterRequests(req) {
  const tomatch = esProxyWhitelist[req.method] || [];
  const matches = tomatch.filter((m) => req.url.match(m)).length;
  return matches > 0;
}

function findObjectByKey(obj, key){
  let found_obj;
  if (typeof(obj) === 'object'){
      Object.keys(obj).forEach(function(obj_key){
          let obj_val = obj[obj_key];
          if (obj_key === key){
              found_obj = obj_val;
          }
          if (found_obj === undefined){
              found_obj = findObjectByKey(obj_val, key);
          }
      });
  }
  return found_obj;
}

export const createESMiddleware = (config) => {
  const superagent = require('superagent');
  const {user, pwd, host, port, index} = config;
  const url = `http://${user}:${pwd}@${host}:${port}/${index}/_search`;
  return function (req, res, next) {
    if (filterRequests(req)) {
      const body = req.body;
      const multi_match = findObjectByKey(body, 'multi_match')
      if (multi_match){
        const search_term = findObjectByKey(multi_match, 'query')
        console.log("SEARCH TERM:", search_term);
      }
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