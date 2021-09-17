import download from './download';

const esProxyWhitelist = {
  GET: ['/es/_search'],
  POST: ['/es/_search'],
};

const esDownloadWhitelist = {
  POST: ['/es/_download'],
};

const esSettingsWhitelist = {
  GET: ['/es/_settings'],
};

function filterRequests(req, whitelist) {
  const tomatch = whitelist[req.method] || [];
  const matches = tomatch.filter((m) => req.url.match(m)).length;
  return matches > 0;
}

export const createESMiddleware = (options) => {
  const superagent = require('superagent');
  const { qa, es, appConfig } = options;

  return function (req, res, next) {
    if (filterRequests(req, esProxyWhitelist)) {
      const body = req.body;
      if (body.question) {
        const { question } = body;
        delete body.question;
        const qaBody = {
          query: question,
          custom_query: JSON.stringify(body),
          top_k_retriever: 100,
          top_k_reader: 4,
        };
        //console.log('qa req', qa, question, qaBody);
        superagent
          .post(qa)
          .send(qaBody)
          .set('accept', 'application/json')
          .end((err, resp) => {
            // eslint-disable-next-line
            console.log(err, resp);
            res.send(resp.body);
          });
      } else {
        const url = `${es}/_search`;
        superagent
          .post(url)
          .send(body)
          .set('accept', 'application/json')
          .end((err, resp) => {
            res.send(resp.body);
          });
      }
    } else {
      if (filterRequests(req, esSettingsWhitelist)) {
        const url = `${es}/_settings`;
        superagent.get(url).end((err, resp) => {
          res.send(resp.body);
        });
      } else {
        if (filterRequests(req, esDownloadWhitelist)) {
          download(es, appConfig, req, res);
        } else {
          next();
        }
      }
    }
  };
};

// function findObjectByKey(obj, key){
//   let found_obj;
//   if (typeof(obj) === 'object'){
//       Object.keys(obj).forEach(function(obj_key){
//           let obj_val = obj[obj_key];
//           if (obj_key === key){
//               found_obj = obj_val;
//           }
//           if (found_obj === undefined){
//               found_obj = findObjectByKey(obj_val, key);
//           }
//       });
//   }
//   return found_obj;
// }

// const multi_match = findObjectByKey(body, 'multi_match')
// if (multi_match){
//   const search_term = findObjectByKey(multi_match, 'query')
//   console.log("SEARCH TERM:", search_term);
// }
// const url = `http://${es.user}:${es.pwd}@${es.host}:${es.port}/${es.index}/_search`;
//
// {
//   "query": "biggest threats",
//   "filters": {
//   },
//   "top_k_retriever":100,
//   "top_k_reader": 3
// }
