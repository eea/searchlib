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
    "crawl",
    default_args=default_args,
    description="Crawl one page",
    schedule_interval=timedelta(days=1),
    start_date=days_ago(2),
    tags=["miahi"],
) as dag:

    read_page = BashOperator(
        task_id="read_page",
        bash_command="date",
    )

    extract_links = BashOperator(
        task_id="extract_links",
        depends_on_past=False,
        bash_command="sleep 5",
        retries=3,
    )

    call_crawl = BashOperator(
        task_id="call_crawl",
        depends_on_past=False,
        bash_command="sleep 5",
        retries=3,
    )

    save_page = BashOperator(
        task_id="save_page",
        depends_on_past=False,
        bash_command="sleep 5",
        retries=3,
    )

    call_harvester = BashOperator(
        task_id="call_harvester",
        depends_on_past=False,
        bash_command="sleep 5",
        retries=3,
    )

    read_page >> [extract_links, save_page]
    extract_links >> [call_crawl]
    save_page >> [call_harvester]
