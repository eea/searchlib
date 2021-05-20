from datetime import timedelta

from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.utils.dates import days_ago

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
    "harvest",
    default_args=default_args,
    description="Harvest one page",
    schedule_interval=timedelta(days=1),
    start_date=days_ago(2),
    tags=["miahi"],
) as dag:

    read_document = BashOperator(
        task_id="read_document",
        bash_command="date",
    )

    extract_metadata = BashOperator(
        task_id="extract_metadata",
        depends_on_past=False,
        bash_command="sleep 5",
        retries=3,
    )

    extract_article = BashOperator(
        task_id="extract_article",
        depends_on_past=False,
        bash_command="sleep 5",
        retries=3,
    )

    extract_article_n3k = BashOperator(
        task_id="extract_article_n3k",
        depends_on_past=False,
        bash_command="sleep 5",
        retries=3,
    )

    extract_keywords = BashOperator(
        task_id="extract_keywords",
        depends_on_past=False,
        bash_command="sleep 5",
        retries=3,
    )

    aggregate_results = BashOperator(
        task_id="aggregate_results",
        depends_on_past=False,
        bash_command="sleep 5",
        retries=3,
    )

    update_es_index = BashOperator(
        task_id="update_es_index",
        depends_on_past=False,
        bash_command="sleep 5",
        retries=3,
    )

    read_document >> [
        extract_metadata,
        extract_article,
        extract_article_n3k,
        extract_keywords,
    ]
    extract_metadata >> [aggregate_results]
    extract_article >> [aggregate_results]
    extract_article_n3k >> [aggregate_results]
    extract_keywords >> [aggregate_results]
    aggregate_results >> [update_es_index]
