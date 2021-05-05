# Harvester

The crawler and harvester form the data ingestion and processing part of the
Search Service.

The **Crawler** takes an initial address (normally a root site URL) and
discovers all the pages or documents on that site, creating a sitemap (list of
links) and a pack of raw data (html, json etc) obtained during the crawling.

The **Harvester** takes the raw data, transforms it (cleans it up, extracts
metadata) to create a document that can be indexed into Elasticsearch.

## Overview

The base layer of the architecture is Apache Airflow. It is an open-source
workflow engine / workflow management platform that offers a simple way of
authoring, scheduling and monitoring workflows. The workflows (called DAGs in
Airflow, from Directed Acyclic Graphs) are Python scripts that describe the
documentation, schedule, input data, each task in the flow, the relationship
between tasks and what data is transferred between tasks. A task is implemented
by an Operator, an entity that describes a single task in a workflow. There are
built-in operators for simple tasks (e.g. sending an e-mail, connecting to a
database or sending a HTTP request), but they can also implement custom actions
(call Python functions, run bash scripts).

A detailed description of the Airflow concepts can be found "here":https://airflow.apache.org/docs/apache-airflow/stable/concepts.html

{{drawio_attach(Airflow diagram_1.svg,size=800)}}

The DAGs are Python scripts using Jinja templates that are read by the Airflow
engine from the filesystem. They can be easily maintained via github. The DAGs
are automatically updated when the files change, so a git pull will install a
new version. Unfortunately there is no built-in support for versioning, so a
filesystem change will overwrite existing DAG definitions.

The Airflow workflows will be based on existing code from the current search
engine (that already implements harvesting and Elasticsearch storage) and
Python custom code for new interactions.

## Airflow configuration

The base configuration of the DAGs will be kept in the "Airflow
variables":https://airflow.apache.org/docs/apache-airflow/stable/howto/variable.html
and
"connections":https://airflow.apache.org/docs/apache-airflow/stable/howto/connection.html.
Using Airflow variables simplifies the setup as we don't have to store them in
a different place and Airflow already provides an UI for managing them.

Airflow includes a communication channel between tasks (XComs), but it is not
suitable for large data. A database will be used to store the intermediate data
during workflow runs, and XComs will only be used for signaling/metadata
transfer between tasks. Keeping the data in the database will also help
debugging and storing old versions of the raw data to decide if data changed
(in case no timestamp metadata exists).

Unfortunately there is no built-in way of calling node.js scripts directly from
Airflow tasks, so any node.js calls (to the existing search engine code) will
have to be wrapped as BashOperator tasks.

To make the workflows dynamic (especially on crawler workflows, when new links
are discovered) workflows will be able to schedule new runs of other workflows
or of the same workflow. There are two main options for this, using "API
calls":https://airflow.apache.org/docs/apache-airflow/stable/stable-rest-api-ref.html#operation/post_dag_run
or by using the Python call
"create_dagrun":https://airflow.apache.org/docs/apache-airflow/stable/_api/airflow/models/dag/index.html.
The difference is that by using the API call a completely independent DAG run
will be created, and by using create_dagrun the new DAG run will be attached to
the current calling DAG, so the current DAG will not finish until the called
runs finish.

Airflow supports multithreading in running a DAG, so multiple instances of the
same DAG can be scheduled to run in parallel. This might introduce issues while
crawling (fetching multiple documents from the same server), but there is no
simple way of signaling between runs that the same website is hit. The
"concurrency":https://airflow.apache.org/docs/apache-airflow/stable/_api/airflow/models/dag/index.html
parameter can specify the max number of parallel runs at DAG level.

Workflow runs can be manually started if needed, but they cannot be prioritized
against already running flows.

## Crawler workflows

The crawler starts with a list of websites to crawl (the root of the website)
and discovers and fetches all the links and documents.

The implementation is based on a startup scheduled DAG that reads the list of
links to crawl (as JSON) from an "airflow
variable":https://airflow.apache.org/docs/apache-airflow/stable/howto/variable.html
and calls a DAG that runs the actual crawl.

{{drawio_attach(crawler startup_1.png,size=600)}}

The actual crawler workflow accepts an URL as input parameter, fetches the
page, saves it to the database as it is (raw page), extracts the links and
schedules new crawler jobs for the new links. As the last step, the crawler
will schedule a harvest workflow to process the stored raw document.

{{drawio_attach(crawler run_1.png,size=800)}}


## Harvester workflows

There will be different types of harvesters based on what kind of documents they can process.

The harvester flow takes a document ID from the database as parameter and cleans up the content, extracts metadata, keywords, integrates with different other processing modules. Depending on the tasks, some of them could be run in parallel and the result of them can be aggregated in the final document, that is indexed in Elasticsearch.

The workflows will follow the ETL pattern:

{{drawio_attach(harvester_1.png,size=800)}}


Technologies to be used:
* existing "EEA Search server libraries":https://github.com/eea/eea.searchserver.js can be integrated in the harvesting and Elasticsearch interaction tasks to cover the supported formats

* "newspaper3k":https://newspaper.readthedocs.io/en/latest/ web page article extractor (python). Can use NLP for keywords / "NLTK ":https://www.nltk.org/. "Sample usage with airflow":https://blog.quiltdata.com/repeatable-nlp-of-news-headlines-using-apache-airflow-newspaper3k-quilt-t4-vega-a0447af57032

* "readability":https://github.com/masukomi/arc90-readability - basically a "reader view" article extractor to extract and clean website text ("python":https://pypi.org/project/readablity-lxml/)

## Database storage

The workflows will use a PostgreSQL database to store the webpage raw data and
the metadata. The crawler will store the data in the database, and the
harvesters will take it from there and process it.

To be able to easily integrate different technologies, a
"PostgREST":https://postgrest.org server will be used to act as a REST
frontend.

When storing data, a task will insert data in a table and use an unique
document ID for it. Then the unique ID will be passed to the next task and the
data can be retrieved based on it. A state column can be used to monitor the
status of the document (crawled/harvested/error etc).

The same pattern can be also used to pass data between DAGs, so when starting
harvesting on already loaded data the ID of the document can be sent as a
parameter.

The tasks can do only inserts/updates in the database, and a scheduled workflow
can delete the old database entries for successfully finished tasks after a
predefined time period. The failed task data can be kept for longer to help
debugging.
