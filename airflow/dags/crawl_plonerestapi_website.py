import json

import requests
from xml.dom import minidom

from airflow.decorators import dag, task
from airflow.models import Variable
from airflow.operators.python_operator import PythonOperator
from airflow.providers.http.operators.http import SimpleHttpOperator
from airflow.utils.dates import days_ago
from airflow.operators import trigger_dagrun


#from ../scripts import crawler

# These args will get passed on to each operator
# You can override them on a per-task basis during operator initialization
default_args = {
    "owner": "airflow",
}


def get_sitemap(sitemap_url, ti):
    print("STEP 1")
    print(sitemap_url)
    res = requests.get(sitemap_url)
    print(res.content)
    print("STEP 2")
    #response = {'res':res.content}
    ti.xcom_push(key="response", value={'a':'b'})
    #return {'a':'b'}


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
        sitemap_url = website_url.split("://")[-1] + "/sitemap.xml.gz"
#        sitemap_url = (
#            "gist.githubusercontent.com/zotya/cbc7af0b8d92e5547ae9"
#            + "8db201f110b1/raw/f1227f8f903c4df3265c7498fd8a5408f9"
#            + "c20334/gistfile1.txt"
#        )
        print("sitemap_url", sitemap_url)
        return sitemap_url

    @task()
    def print_sitemap(sitemap: str):
        print("sitemap", sitemap)

    @task()
    def get_urls_from_sitemap(sitemap: str):
        response = []
        dom = minidom.parseString(sitemap)
        urls = dom.getElementsByTagName('url')
        for url in urls:
            item = {
                "url":url.getElementsByTagName('loc')[0].firstChild.nodeValue,
                "date":url.getElementsByTagName('lastmod')[0].firstChild.nodeValue,
                }
            response.append(item)
        print(response)
        return response

    @task()
    def print_urls(urls: object):
        print("urls:",urls)

    show_dag_run_conf(website_url, maintainer_email)

    sitemap_url = get_sitemap_url(website_url)
    
    #sitemap = PythonOperator(
    #    task_id = 'get_sitemap_request',
    #    python_callable = get_sitemap,
    #    op_kwargs={'sitemap_url':sitemap_url}
    #)

    sitemap = SimpleHttpOperator(
        task_id="get_sitemap",
        method="GET",
#        http_conn_id="http_default",
        endpoint=sitemap_url,
#        log_response=True,
    )

    print_sitemap(sitemap.output)

    urls = get_urls_from_sitemap(sitemap.output)

#    for url in urls:
#        pass
#        print("trigger_url:", url['url'])
#        trigger_dagrun.TriggerDagRunOperator(
#            task_id="trigger_fetch_url",
#            trigger_dag_id="fetch_url",
#            conf={"url": url['url'], "maintainer_email": "tibi@example.com"},
#        )

#    trigger_fetch_for_urls(urls)
crawl_website_dag = crawl_plonerestapi_website()
