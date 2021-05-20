from datetime import timedelta

from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.utils.dates import days_ago

# from textwrap import dedent


default_args = {
    "owner": "airflow",
    "depends_on_past": False,
    "email": ["me@miahi.ro"],
    "email_on_failure": False,
    "email_on_retry": False,
    "retries": 1,
    "retry_delay": timedelta(minutes=5),
}
with DAG(
    "crawl_start",
    default_args=default_args,
    description="Scheduled crawl startup",
    schedule_interval=timedelta(days=1),
    start_date=days_ago(2),
    tags=["miahi"],
) as dag:

    read_site_list = BashOperator(
        task_id="read_site_list",
        bash_command="date",
    )

    iterate_start = BashOperator(
        task_id="iterate_start",
        depends_on_past=False,
        bash_command="sleep 5",
        retries=3,
    )

    read_site_list >> [iterate_start]
