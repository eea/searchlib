# Running as standalone app


The standalone version runs as a Razzle-powered application, available in the
`packages/searchlib-standalone`.

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

The production runtime can be configured via environment variables:

- `ELASTIC_URL`: this is the internally accessible address of the ElasticSearch
  server. Setting this allows the searchlib-standalone to expose ES through a
  proxy, to aid with CORS issues.
- `RAZZLE_ES_INDEX`: this variable is exposed in the frontend application and
  should match the ElasticSeach index that needs to be queried.
- `RAZZLE_APP_NAME`: this is the name of the "branch" of the configuration
  registry that should be used in configuring the searchlib-powered
  application.
