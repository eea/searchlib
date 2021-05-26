import json
from xml.dom import minidom

import requests
from airflow.decorators import dag, task
from airflow.models import Variable
from airflow.operators.python_operator import PythonOperator
from airflow.providers.http.operators.http import SimpleHttpOperator
from airflow.utils.dates import days_ago

import helpers
# from ../scripts import crawler

# These args will get passed on to each operator
# You can override them on a per-task basis during operator initialization
default_args = {
    "owner": "airflow",
}

@dag(
    default_args=default_args,
    schedule_interval=None,
    start_date=days_ago(2),
    tags=["crawl"],
)
def fetch_url(item: str = ""):
    """
    ### get info about an url
    """

    @task()
    def get_api_url(url):
        no_protocol_url = url.split("://")[-1]
        url_parts = no_protocol_url.split("/")
        url_parts.insert(1, "api")
        url_with_api = "/".join(url_parts)
        # url_with_api = 'https://'+url_with_api
        print(url_with_api)
        return url_with_api

    url_with_api = get_api_url(item)
    doc = SimpleHttpOperator(
        task_id="get_doc",
        method="GET",
        endpoint=url_with_api,
        headers={"Accept": "application/json"},
    )

    
    @task
    def print_doc(doc):
        print("doc:", doc)

    helpers.debug_value(doc.output)

    helpers.show_dag_run_conf({"item":item})


fetch_url_dag = fetch_url()
