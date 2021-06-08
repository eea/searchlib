# Airflow config

For development (easier access to dag files) use the following:

```
cp docker-compose.override.yaml.dev docker-compose.override.yaml
mkdir -p data/logs data/plugins data/pg data/es data/rabbitmq
sudo chown -R 50000:50000 data
sudo chown -R 1000:1000 data/es
```

The Airflow DAGs are hosted at https://github.com/eea/eea-crawler/ and are
linked here as a Git submodule.

The image for Airflow is hosted at https://github.com/eea/eea.docker.airflow/
and it's linked as a Git submodule. We need this custom image, because we
have our custom requirements.txt

The image for Logstash is hosted at https://github.com/eea/eea.docker.logstash/
and it's linked as a Git submodule. We need it to define our customizations.

To bring them here, make sure to run:
```
git submodule init
git submodule update
```
