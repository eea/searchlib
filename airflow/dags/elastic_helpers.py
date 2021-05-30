from airflow.decorators import task
from airflow.models import Variable
from elasticsearch import Elasticsearch


def get_elastic_config():
    conf = {}
    conf["host"] = Variable.get("elastic_host")
    conf["port"] = Variable.get("elastic_port")
    conf["index"] = Variable.get("elastic_index")
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
    es.index(index=conf["index"], id=doc["id"], body=doc)
