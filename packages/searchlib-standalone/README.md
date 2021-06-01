# Searchlib Standalone service

This is the main standalone flavour of Searchlib. It provides a standalone
service implementing an ElasticSearch connected search application.

It includes an ElasticSearch proxy, to avoid CORS problems. To use it, when
starting the application, first export an environment variable `ELASTIC_URL`.

To configure the used ElasticSearch index, export `RAZZLE_ES_INDEX`. If the
client process will communicate directly with the ElasticSearch server, export
a `RAZZLE_ES_HOST` variable.


## Configuration

You can expose a JSON string with the configuration, as `RAZZLE_ENV_CONFIG`. It
will be `JSON.parse`d.
