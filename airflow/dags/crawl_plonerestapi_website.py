import json

from airflow.decorators import dag, task
from airflow.models import Variable
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
    tags=["crawl"],
)
def crawl_plonerestapi_website(website_url: str = "", maintainer_email: str = ""):
    """
    ### Crawls a plone.restapi powered website.

    Main task to crawl a website
    """

    @task()
    def show_dag_run_conf(website_url, maintainer_email):
        # start_url, maintainer_email="no-reply@plone.org"
        print("website conf", website_url, maintainer_email)

    show_dag_run_conf(website_url, maintainer_email)


crawl_website_dag = crawl_plonerestapi_website()
