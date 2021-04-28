import fetch from 'node-fetch';
import https from 'https';

// Don't do this in production, this is in place to aid with demo environments which have self-signed certificates.
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export default async function runRequest(body) {
  const host = process.env.ELASTICSEARCH_HOST || 'http://localhost:9200';
  const index = 'esbootstrapdata-wise_latest';
  // const agent = host.startsWith('http:') ? httpAgent : httpsAgent;

  const url = `${host}/${index}/_search`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    agent: httpsAgent,
  });

  try {
    const body = await resp.text();
    return { statusCode: resp.status, body: JSON.parse(body) };
  } catch (e) {
    return { statusCode: 500, body: `An error occurred: ${e}` };
  }
}
