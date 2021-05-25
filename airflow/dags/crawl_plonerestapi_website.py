import json

import requests
from airflow.decorators import dag, task
from airflow.models import Variable
from airflow.operators.python_operator import PythonOperator
from airflow.providers.http.operators.http import SimpleHttpOperator
from airflow.utils.dates import days_ago

# These args will get passed on to each operator
# You can override them on a per-task basis during operator initialization
default_args = {
    "owner": "airflow",
}


def get_sitemap(sitemap_url, ti):
    print("STEP 1")
    res = requests.get(sitemap_url)
    print(res)
    print("STEP 2")
    ti.xcom_push(key="response", value=res)


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

    @task()
    def get_sitemap_url(website_url: str):
        #      sitemap_url = website_url.split("://")[-1] + "/sitemap.xml.gz"
        sitemap_url = (
            "gist.githubusercontent.com/zotya/cbc7af0b8d92e5547ae9"
            + "8db201f110b1/raw/f1227f8f903c4df3265c7498fd8a5408f9"
            + "c20334/gistfile1.txt"
        )
        print("sitemap", sitemap_url)
        return sitemap_url

    @task()
    def print_sitemap(sitemap: str):
        print("sitemap", sitemap)

    show_dag_run_conf(website_url, maintainer_email)

    sitemap_url = get_sitemap_url(website_url)

    sitemap = SimpleHttpOperator(
        task_id="get_sitemap",
        method="GET",
        http_conn_id="http_default",
        endpoint=sitemap_url,
        log_response=True,
    )

    print_sitemap(sitemap.output)


crawl_website_dag = crawl_plonerestapi_website()
