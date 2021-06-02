# Airflow config

For development (easier access to dag files) use the following:

```
cp docker-compose.override.yaml.dev docker-compose.override.yaml
mkdir -p data/logs data/plugins data/pg data/es
sudo chown -R 50000:50000 data
sudo chown -R 1000:1000 data/es
```

The Airflow DAGs are hosted at https://github.com/eea/eea-crawler/ and are
linked here as a Git submodule. To bring them here, make sure to run:

```
git submodule init
git submodule update
```
