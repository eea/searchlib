# Airflow development repo for EEA-Crawler

For development (easier access to dag files) use the following:

```
cp docker-compose.override.yaml.dev docker-compose.override.yaml
mkdir -p data/logs data/plugins data/pg data/es data/rabbitmq
sudo chown -R 50000:50000 data
sudo chown -R 1000:1000 data/es
```

## Airflow deployment architecture

We use and link here several custom docker images

- **Airflow custom docker image**, linked from https://github.com/eea/eea.docker.airflow/
  It loads needed Python libraries with a custom requirements.txt
- **Airflow DAGs**, linked from https://github.com/eea/eea-crawler/
- **Logstash configuration**, linked from https://github.com/eea/eea.docker.logstash/

To bring them here, make sure to run:
```
git submodule init
git submodule update
```
