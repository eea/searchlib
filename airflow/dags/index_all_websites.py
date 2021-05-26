import json

from airflow.decorators import dag, task
from airflow.models import Variable
from airflow.operators import trigger_dagrun
from airflow.utils.dates import days_ago

import helpers

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

#    xxx = Variable.get("foo")
    configured_websites = Variable.get("indexed_websites", deserialize_json=True)
#    xxx2 = Variable.get("foo_baz", deserialize_json=True)
#    xxx3 = Variable.get("test_websites", deserialize_json=True)
#    xxx4 = Variable.get("indexed_websites")
#    xxx5 = Variable.get("indexed_websites", deserialize_json=True)

    @task
    def print_value(val):
        print ("type:", type(val))
        print ("value:", val)
    
#    print ("ABC")
#    configured_websites = ["https://biodiversity.europa.eu"]
    
    #print_value(xxx)
 #   print_value(xxx5)
#    x = helpers.nicename('asdf:asfsd/fq re/qe123')
#    print_value(x)
    for site_url in configured_websites:
        task_id = 'trigger_crawl_dag_' + helpers.nicename(site_url)
        trigger_dagrun.TriggerDagRunOperator(
            task_id=task_id,
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
