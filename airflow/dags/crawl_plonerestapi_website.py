import json

from airflow.decorators import dag, task
from airflow.models import Variable
from airflow.utils.dates import days_ago
from airflow.providers.http.operators.http import SimpleHttpOperator
from airflow.operators.python_operator import PythonOperator

import requests
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

def get_sitemap(sitemap_url, ti):
  print("STEP 1")
  res = requests.get(sitemap_url)
  print(res)
  print("STEP 2")
  ti.xcom_push(key = 'response', value = res)

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

    @task()
    def get_sitemap_url(website_url):
#      sitemap_url = website_url.split("://")[-1] + "/sitemap.xml.gz"
      sitemap_url = "gist.githubusercontent.com/zotya/cbc7af0b8d92e5547ae98db201f110b1/raw/f1227f8f903c4df3265c7498fd8a5408f9c20334/gistfile1.txt"
      print("sitemap", sitemap_url)
      return sitemap_url

    sitemap_url = get_sitemap_url(website_url)

#    sitemap = SimpleHttpOperator(
#      task_id='get_sitemap',
#      method='GET',
##      http_conn_id='http_default',
#      endpoint=sitemap_url
##      log_response=True
#    )

    sitemap = PythonOperator(
      task_id = 'get_sitemap_request',
      python_callable = get_sitemap,
      op_kwargs={'state':sitemap_url}
    )

#    @task()
#    def print_sitemap(sitemapx):
#      print("sitemap", sitemapx)
##      print("response", {{ task_instance.xcom_pull(task_ids='get_sitemap_url', dag_id='crawl_plonerestapi_website', key='return_value') }})

#    print_sitemap(sitemap.output)
#    sitemap >> print_sitemap
#    print_sitemap(sitemapx="sitemapx: {{ task_instance.xcom_pull(task_ids='get_sitemap', dag_id='crawl_plonerestapi_website', key='return_value') }}")


crawl_website_dag = crawl_plonerestapi_website()
