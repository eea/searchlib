# NLPService Endpoints


## Converter

---
#### *Path*
```textmate
POST /api/converter
```


## Sentence Embedding

---
#### *Path*
```textmate
POST /api/embedding
```
#### *Description*

A sentence or passage embedding service. It uses two models, one suitable for long text (passages) and one for short text (queries).



## Feedback

---
#### *Path*
```textmate
POST /api/feedback
```
#### *Description*

An endpoint to allow users to write feedback and correct classification on documents.


## Language Detect

---
#### *Path*
```textmate
POST /api/langdetect
```


## Named-entity Recognition

---
#### *Path*
```textmate
POST /api/ner
```

## Question and Answer

---
#### *Path*
```textmate
POST /api/query
```
#### *Description*

Based on the search term query, it extracts answers from the ES results.

## Question Classifier

---
#### *Path*
```textmate
POST /api/query-classifier
```
#### *Description*

Common Query types
  #### - Keyword Queries:

  Such queries don't have semantic meaning, merely consist of keywords and the order of words does not matter:

> * arya stark father
> * jon snow country
> * arya stark younger brothers


  #### - Questions (Interrogative Queries):

  In such queries users ask a question in a complete, "natural" sentence.

  Regardless of the presence of "?" in the query the goal here is to detect the
  intent of the user whether any question is asked or not in the query:


 > * who is the father of arya stark?
 > * which country was jon snow filmed in
 > * who are the younger brothers of arya stark?


  #### 3. Statements (Declarative Queries):
  Such queries consist also of a regular, natural sentence with semantic
  relations between the words. However, they are rather a statement than
  a question:
 
 > * Arya stark was a daughter of a lord.
 > * Show countries that Jon snow was filmed in.
 > * List all brothers of Arya.

 
## Question Generation

---
#### *Path*
```textmate
POST /api/questiongeneration
```
#### *Description*

TBD

## Semantically Re-ranked ElasticSearch queries

---
#### *Path*
```textmate
POST /api/_search
```
#### *Description*

 A drop-in replacement of an ElasticSearch endpoint that can re-rank normal full-text queries.


## Similarity

---
#### *Path*
```textmate
POST /api/similarity
```


## Named-entity Recognition Spacy

---
#### *Path*
```textmate
POST /api/ner-spacy
```

## Zeroshot Classifier

---
#### *Path*
```textmate
POST /api/zeroshot
```

