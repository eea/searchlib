from xml.dom import minidom

from airflow.decorators import dag, task
from airflow.providers.http.operators.http import SimpleHttpOperator
from airflow.utils.dates import days_ago

from bulk_trigger_dagrun import BulkTriggerDagRunOperator

# These args will get passed on to each operator
# You can override them on a per-task basis during operator initialization
default_args = {
    "owner": "airflow",
}


@task()
def get_sitemap_url(website_url: str):
    sitemap_url = website_url.split("://")[-1] + "/sitemap.xml.gz"
    print("sitemap_url", sitemap_url)
    return sitemap_url


@task()
def get_urls_from_sitemap(sitemap: str):
    response = []
    dom = minidom.parseString(sitemap)
    urls = dom.getElementsByTagName("url")
    for url in urls:
        item = {
            "url": url.getElementsByTagName("loc")[0].firstChild.nodeValue,
            "date": url.getElementsByTagName("lastmod")[0].firstChild.nodeValue,
        }
        response.append(item)
    print(response)
    return response


@task
def get_urls_to_update(urls: list = []) -> dict:
    my_clean_urls = []
    for url in urls:
        my_clean_urls.append(url["url"])
    print(my_clean_urls)
    return my_clean_urls


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

    #   helpers.show_dag_run_conf(
    #        {"website_url": website_url, "maintainer_email": maintainer_email}
    #    )

    sitemap_url = get_sitemap_url(website_url)

    xc_sitemap = SimpleHttpOperator(
        task_id="get_sitemap",
        method="GET",
        endpoint=sitemap_url,
    )

    #    helpers.debug_value(xc_sitemap.output)

    xc_urls = get_urls_from_sitemap(xc_sitemap.output)

    xc_clean_urls = get_urls_to_update(xc_urls)

    BulkTriggerDagRunOperator(
        task_id="fetch_urls",
        items=xc_clean_urls,
        trigger_dag_id="fetch_url",
        parent=website_url,
    )


crawl_website_dag = crawl_plonerestapi_website()


# [2021-05-26 04:24:45,042] {logging_mixin.py:104} INFO - kwargs
# [2021-05-26 04:24:45,043] {logging_mixin.py:104} INFO - {'conf': <airflow.configuration.AirflowConfigParser object at 0x7f84bce49da0>,
#  'dag': <DAG: crawl_plonerestapi_website>,
#  'dag_run': <DagRun crawl_plonerestapi_website @ 2021-05-26 04:24:22.463409+00:00: manual__2021-05-26T04:24:22.453381+00:00, externally triggered: True>,
#  'ds': '2021-05-26',
#  'ds_nodash': '20210526',
#  'execution_date': DateTime(2021, 5, 26, 4, 24, 22, 463409, tzinfo=Timezone('+00:00')),
#  'inlets': [],
#  'macros': <module 'airflow.macros' from '/home/airflow/.local/lib/python3.6/site-packages/airflow/macros/__init__.py'>,
#  'next_ds': '2021-05-26',
#  'next_ds_nodash': '20210526',
#  'next_execution_date': DateTime(2021, 5, 26, 4, 24, 22, 463409, tzinfo=Timezone('+00:00')),
#  'outlets': [],
#  'params': {'maintainer_email': 'tibi@example.com',
#             'website_url': 'https://biodiversity.europa.eu'},
#  'prev_ds': '2021-05-26',
#  'prev_ds_nodash': '20210526',
#  'prev_execution_date': DateTime(2021, 5, 26, 4, 24, 22, 463409, tzinfo=Timezone('+00:00')),
#  'prev_execution_date_success': <Proxy at 0x7f84b1b19948 wrapping None at 0x7f84bfc84110 with factory <function TaskInstance.get_template_context.<locals>.<lambda> at 0x7f84b1b37ea0>>,
#  'prev_start_date_success': <Proxy at 0x7f84b1e6ca08 wrapping None at 0x7f84bfc84110 with factory <function TaskInstance.get_template_context.<locals>.<lambda> at 0x7f84b1ecde18>>,
#  'run_id': 'manual__2021-05-26T04:24:22.453381+00:00',
#  'task': <Task(PythonOperator): trigger_fetch_for_urls>,
#  'task_instance': <TaskInstance: crawl_plonerestapi_website.trigger_fetch_for_urls 2021-05-26T04:24:22.463409+00:00 [running]>,
#  'task_instance_key_str': 'crawl_plonerestapi_website__trigger_fetch_for_urls__20210526',
#  'templates_dict': None,
#  'test_mode': False,
#  'ti': <TaskInstance: crawl_plonerestapi_website.trigger_fetch_for_urls 2021-05-26T04:24:22.463409+00:00 [running]>,
#  'tomorrow_ds': '2021-05-27',
#  'tomorrow_ds_nodash': '20210527',
#  'ts': '2021-05-26T04:24:22.463409+00:00',
#  'ts_nodash': '20210526T042422',
#  'ts_nodash_with_tz': '20210526T042422.463409+0000',
#  'var': {'json': None, 'value': None},
#  'yesterday_ds': '2021-05-25',
#  'yesterday_ds_nodash': '20210525'}
