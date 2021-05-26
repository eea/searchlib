from elasticsearch import Elasticsearch

from airflow.decorators import task
from airflow.models import Variable


def get_elastic_config():
    conf = {}
    conf["host"] = Variable.get("elastic_host")
    conf["port"] = Variable.get("elastic_port")
    return conf


def connect(conf):
    es = Elasticsearch(
        host=conf["host"],
        port=conf["port"],
    )
    return es


@task
def index_doc(doc):
    conf = get_elastic_config()
    es = connect(conf)
    es.index(index="test1", id=doc["id"], body=doc)
