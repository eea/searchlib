import superagent from 'superagent';

export default async function runRequest(body, config, url) {
  const { host, elastic_index } = config;

  // url = url || `${host}/${elastic_index}/_search`;

  let dest;
  if (url) {
    dest = url;
  } else {
    dest = new URL(host);
    dest.pathname = `/${elastic_index}/_search`;
  }

  let resp;
  try {
    resp = await superagent
      .post(dest.toString())
      .send(body)
      .set('accept', 'application/json');
    return resp;
  } catch (e) {
    return { statusCode: 500, body: `An error occurred: ${e}` };
  }
}
