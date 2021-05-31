from airflow.decorators import dag  # , task
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

    configured_websites = Variable.get("indexed_websites", deserialize_json=True)

    #    helpers.debug_value(configured_websites)

    for site_url in configured_websites:
        task_id = "trigger_crawl_dag_" + helpers.nicename(site_url)
        trigger_dagrun.TriggerDagRunOperator(
            task_id=task_id,
            trigger_dag_id="crawl_plonerestapi_website",
            conf={
                "website_url": site_url,
                # TODO: read also maintainer from configuration
                "maintainer_email": "tibi@example.com",
            },
        )


index_all_websites_dag = index_all_websites()
