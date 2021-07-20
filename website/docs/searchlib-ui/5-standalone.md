# Running as standalone app


The standalone version runs as a Razzle-powered application, available in the
`packages/searchlib-standalone`.

You need to start the process with the following environment variables:

- `RAZZLE_APP_NAME`: this is the name of the "branch" of the configuration
  registry that should be used in configuring the searchlib-powered
  application.


## Development

Right now it's not possible to include and compile `searchlib` as development
package in the `searchlib-standalone` application. So the first step is to
start a `webpack watch` process in the `searchlib` folder, by running:

```
cd packages/searchlib
pnpm run watch
```

The go to the searchlib-standalone folder:

```
cd packages/searchlib-standalone
pnpm run start
```

## Production

For production we have a docker image prepared, with a Dockerfile in the root
of the searchlib repo. See the docker-compose.yml file in that location for how
to run it.

When running the searchlib app in a user's browser, it needs to connect to the
ElasticSearch server. You need to run the process with the following
environment variables:

- `RAZZLE_ES_PROXY_ADDR`: The address of the proxy. It defaults to
  `window.location.hostname`, but can be different if the proxy is running
  independently of the application

### Running with embedded proxy

To avoid CORS issues, we have the option of running an embedded proxy.

Searchlib standalone includes an ES proxy which can be configured with the
following environment variables:

- `PROXY_ELASTIC_HOST`: this is the internally accessible
  host and port number of the ElasticSearch server. Setting this allows the
  searchlib-standalone to expose ES through a proxy, to aid with CORS issues.
  If not specified, 'localhost' and '9200' will be used.
- `PROXY_ELASTIC_PORT`: See above
- `PROXY_ELASTIC_USER`: if specified, these credentials will be used to create
  the connection for ElasticSearch
- `PROXY_ELASTIC_PWD`: See above
- `PROXY_ELASTIC_INDEX`: The name of the index what will be made available via
  the proxy. Other indices will not be accessible.
