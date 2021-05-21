import json

from airflow.decorators import dag, task
from airflow.models import Variable
from airflow.operators import trigger_dagrun
from airflow.utils.dates import days_ago

# These args will get passed on to each operator
# You can override them on a per-task basis during operator initialization
default_args = {
    "owner": "airflow",
}


@dag(
    default_args=default_args,
    schedule_interval=None,
    start_date=days_ago(2),
    tags=["meta_workflow"],
)
def index_all_websites():
    """
    ### Triggers reindexing of all websites

    Reads the `INDEXED_WEBSITES` environment variable and triggers a reindexing
    DAG for all of them.
    """

    configured_websites = Variable.get("INDEXED_WEBSITES", deserialize_json=True)

    for site_url in configured_websites:
        trigger_dagrun.TriggerDagRunOperator(
            task_id="trigger_crawl_dag",
            trigger_dag_id="crawl_plonerestapi_website",
            conf={"website_url": site_url, "maintainer_email": "tibi@example.com"},
        )


index_all_websites_dag = index_all_websites()

# @task()
# def load(websites: dict):
#     """
#     #### Load task
#
#     For each provided website + metadata, trigger a dag run
#     """
#     for url in websites["websites"]:
#         trigger_dagrun()
#
#     print("Websites: %s" % websites)

# load(dags)

# @task()
# def extract():
#     """
#     #### Extract task
#     A simple Extract task to get data ready for the rest of the data
#     pipeline. In this case, getting data is simulated by reading from a
#     hardcoded JSON string.
#     """
#     print("Websites: %s" % configured_websites)
#
#     return {"websites": configured_websites}
#
# @task(multiple_outputs=True)
# def transform(websites: dict):
#     """
#     #### Transform task
#     Generates metadata for each dag to be triggered
#     """
#     print("Websites: %s" % websites)
#
#     return websites
#
# # trigger_dags =
# websites = extract()
# dags = transform(websites)
# print("dags", dags)
# dags >> triggers
