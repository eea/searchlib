# Overview

NLP Service is a tool that provides services for ``Natural Language Processing``.

The application is based on Haystack and creates NLP services that define and add Haystack nodes(components) to Haystack Pipelines, runs the Pipelines and expose them through APIs.
Also the NLPService is based on FastAPI framework and is deployed using Docker and Docker Compose.
Elastic Search is used by some of the services.

You can customize which services to start via an environment variable:
```shell
export NLP_SERVICES="embedding,ner,summarizer"
```


#### It provides the following services:

- ``Named-entity recognition (NER)`` for recognizing entities that are present in a given text document. NER works by locating and identifying the named entities present in unstructured text into the standard categories such as person names, locations, organizations, time expressions, quantities, monetary values, percentage, codes etc.
- ``Question and answer`` that, based on the search term query, extracts answers from the ElasticSearch results.
- ``Questions generation`` that is used for generating (question, answer) pairs based on a given text
- ``Question classifier`` that classifies a text as keyword query, interrogative query or declarative query
- ``Language detection`` for predicting a list of languages used inside a given text.
- ``Feedback`` that allows feedback input from users on the quality of the generated answers for a particular query.
- ``Converter`` that converts a text from a given URL into a list of Documents. It receives a URL with the given text and returns a list of Documents created based on the given text.
- ``Sentence Embedding`` used for representing sentences as semantically-meaningful real-valued vectors. 
- ``Semantically Re-ranked ElasticSearch queries`` a drop-in replacement of an ElasticSearch endpoint that can re-rank normal full-text queries. A service that combines search and QA.
- ``Similarity`` for computing the textual similarity between given text and a list of candidates texts
- ``Zeroshot Classifier`` for predicting the label of a text based on given list of candidate labels.

### Haystack General Information
NLPService module is implemented based on Haystack, an open-source framework for building search systems that works intelligently over large document collections.
Recent advances in NLP have enabled the application of question answering, retrieval and summarization to real world settings and Haystack is designed to be the bridge between research and industry.
Haystack is an end-to-end framework that enables the creation of powerful and production-ready pipelines for different search use cases.
https://github.com/deepset-ai/haystack

NLPService is build on top of the Haystack pipeline concept that allows for custom routing of queries to only the relevant components also called Haystack nodes.

Nodes are the core components that process and route incoming text. Some perform steps like preprocessing, retrieving or summarizing text while route queries through different branches of a Pipeline. Nodes are chained together using a Pipeline and they function like building blocks that can be easily switched out for each other. A Node takes the output of the previous Node (or Nodes) as input.
All Nodes are designed to be useable within a Pipeline. When adding a Node to a Pipeline and call ``Pipeline.run()``, it calls each Node's run() method in the predefined sequence.
To build modern search pipelines, two things are needed: powerful building blocks and an easy way to stick them together. The Pipeline class is precisely built for this purpose and enables many search scenarios beyond QA. The core idea is to build a Directed Acyclic Graph (DAG) where each Node is one building block (Reader, Retriever, Generator). Here's a simple example for a standard Open-Domain QA Pipeline:

```python
from haystack import Pipeline

p = Pipeline()
p.add_node(component=retriever, name="ESRetriever1", inputs=["Query"])
p.add_node(component=reader, name="QAReader", inputs=["ESRetriever1"])
res = p.run(query="What did Einstein work on?")

```

### NLPService Workflow

The Entrypoint of the NLPService is ``app/main.py``.

The following operations are done in the ``app/main.py``:

#### 1. Get the configuration:

First step in the ``main.py`` is to call the ``app/config.py`` where the pipeline names are defined  and where the Haystack configuration from ``app/conf/app.yml`` is loaded. In the ``app/conf/app.yml`` are defined all the building-blocks (services) for the Pipeline.
The configurations can also be taken from the ``environment variables``.

#### 2. Instantiate each component, loaded based on definitions from the ``/conf/app.yml`` or from environment:

The application takes every service defined at ``conf/app.yml`` and loads its configuration, creating a list for the COMPONENTS and for the PIPELINES. It also loads the packages, the tags, the prefix and the description of every service.
The configurations for the services can be found in ``app/config`` folder.

A configuration file for a service has the following structure:
```yml
version: '1.0'

package: app.api.zeroshot # the package for the API
prefix: /zeroshot # the route for the API
tags:
  - classifier

components: # the components / the  building-blocks or the nodes for the Haystack Pipeline
  - name: ZeroShotClassifier
    type: TransformersPipeline
    params:
      task: zero-shot-classification
      model: cross-encoder/nli-roberta-base

pipelines: # the Haystack pipeline
  - name: zeroshotPipelineModel
    type: Query
    threshold: 0.1
    nodes:
      - name: ZeroShotClassifier # this is defined above
        inputs: [Query]
```
#### 3. Start NLPService for exposing the API for every service that was defined in the configuration and that had the components loaded in the previous steps.


### NLPService API Workflow

NLPService is based on the FastAPI flexible Python library for creating API endpoints.
FastAPI leverages the Pydantic library for defining data models. These data models are exposed as inputs or outputs to API endpoints. Pydantic data models are simply classes with attributes, and these attributes are defined with types. Pydantic provides several standard data types, such as str, bool, and int, but it also includes a variety of additional types, such as FilePath.

The APIs exposed by NLPService are the ones corresponding the services that are defined in the configuration file and are consumed based on the ``prefix`` (route) and ``package``.

When an API is called the NLPService is aware of the package were the respective API is residing. The API packages can be found in ``app/api`` folder.

An API for a NLPService has the following package structure:

```
-api.py
-routes.py
-service.py
-runtimetest.py
```

The ``api.py`` contains the definitions for the ``request`` and the ``response`` formats defined according with FastAPI  Pydantic library.

In the ``routes.py`` are defined the API routes and HTTP methods.

The ``service.py`` defines the FastAPI model that is used by the API.

Every model for the API that is exposing a NLPService service inherits a PipelineModel  from ``app/core/pipelines.py``.

It is mandatory that in the API model defined by the APIs ``service.py`` the ``pipeline name`` to be specified. Based on the pipeline given name the ``PipelineModel`` class identifies the Pipeline for a service.

The constructor of the class PipelineModel (``app/core/pipelines.py``) searches the name of the pipeline in the ``PIPELINES`` parametes defined  in the section ``NLPService workflow`` and gets its configurations, components and pipelines declared at the configuration step.
At this moment, the Nodes for the Haystack Pipeline are loaded using
```python
pipeline.add_node(
    component=component, name=name, inputs=node.get("inputs", [])
)
```
The method ``predict`` from PipelineModel class calls the Haystack ``run`` method that based on the nodes of the defined pipeline will trigger the running of the pipeline.

```Python
result = pipeline.run(**request)
```

Depending on the service exposed by a NLPService API, inside the ``service.py`` from the package API, the API model can override some methods of the PipelineModel class in order to ``preprocess`` and ``postprocess`` the data for the Pipeline.


### How to start NLPService

1. Clone the repository:
```shell
git clone https://github.com/eea/nlp-service/tree/master
cd nlp-service
```
2. Edit ``run.sh``

Edit ``run.sh`` script in order to add or remove the services that will be loaded and exposed as API when the application will start.
This line defines the services ``export SEARCH_SERVICES=feedback,qa,search,similarity,qasearch``.

Also please be informed that the ElasticSearch host and port defined in the ``run.sh`` script  is only accessible in the EEA network.

3. Create Docker image and start docker container:
```shell
docker-compose -f docker-compose_cpu.yml up
```

4. Execute ``run.sh`` script inside the Docker Container
Open a new Terminal and execute:

```shell
docker-compose -f docker-compose_cpu.yml exec nlp bash
./run.sh
```



5. Open a browser and go to:  ``http://localhost:8000``
