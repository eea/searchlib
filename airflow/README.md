# Airflow config

For development (easier access to dag files) use the following:

```
cp docker-compose.override.yaml.dev docker-compose.override.yaml
mkdir dags
mkdir logs
mkdir plugins
chown 50000:50000 dags logs plugins
```
