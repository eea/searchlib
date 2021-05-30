import json

from airflow.decorators import dag, task
from airflow.providers.http.operators.http import SimpleHttpOperator
from airflow.utils.dates import days_ago
from eea.rabbitmq.client import RabbitMQConnector

import helpers

# These args will get passed on to each operator
# You can override them on a per-task basis during operator initialization
default_args = {
    "owner": "airflow",
}


@task()
def get_api_url(url):
    no_protocol_url = url.split("://")[-1]
    url_parts = no_protocol_url.split("/")
    url_parts.insert(1, "api")
    url_with_api = "/".join(url_parts)
    print(url_with_api)
    return url_with_api


@task
def get_relevant_data(doc, item, parent):
    json_doc = json.loads(doc)
    print(type(json_doc))
    print(json_doc)
    data = {}
    data["title"] = json_doc.get("title", "no title")
    data["review_state"] = json_doc.get("review_state", "no state")
    data["modified"] = json_doc.get("modified", "not modified")
    data["UID"] = json_doc.get("UID")
    data["id"] = helpers.nicename(item)
    data["cluster"] = parent
    return data


@task
def send_to_rabbitmq(doc):
    rabbit_config = {
        "rabbit_host": "rabbitmq",
        "rabbit_port": "5672",
        "rabbit_username": "guest",
        "rabbit_password": "guest",
    }
    queue_name = "es_indexing"

    rabbit = RabbitMQConnector(**rabbit_config)
    rabbit.open_connection()
    rabbit.declare_queue(queue_name)
    rabbit.send_message(queue_name, json.dumps(doc))
    rabbit.close_connection()


@dag(
    default_args=default_args,
    schedule_interval=None,
    start_date=days_ago(2),
    tags=["crawl"],
)
def fetch_url(item: str = "", parent: str = ""):
    """
    ### get info about an url
    """
    url_with_api = get_api_url(item)
    doc = SimpleHttpOperator(
        task_id="get_doc",
        method="GET",
        endpoint=url_with_api,
        headers={"Accept": "application/json"},
    )

    prepared_data = get_relevant_data(doc.output, item, parent)
    send_to_rabbitmq(prepared_data)


fetch_url_dag = fetch_url()

#    helpers.debug_value(parent)
#    helpers.debug_value(doc.output)
#    helpers.debug_value(prepared_data)
#    helpers.show_dag_run_conf({"item": item})
# es_conf = elastic_helpers.get_elastic_config()
# es_conn = elastic_helpers.connect(es_conf)
#    elastic_helpers.index_doc(prepared_data)
# import requests
# from airflow.models import Variable
# from airflow.operators.python_operator import PythonOperator
# import elastic_helpers
# from xml.dom import minidom
# from ../scripts import crawler
