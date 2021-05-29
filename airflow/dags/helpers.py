import re

from airflow.decorators import task

# from pprint import pprint


def nicename(value):
    return re.sub("[^a-zA-Z0-9\n.]", "_", value)


@task()
def show_dag_run_conf(conf):
    # start_url, maintainer_email="no-reply@plone.org"
    print("DAG RUN CONF", conf)


@task
def debug_value(val):
    print("type:", type(val))
    print("value:", val)
