# NLPService Endpoints


## Converter ***

---
#### *Path*
```textmate
POST /api/converter
```
#### *Description*

Converts a text into a list of Documents. 

It receives an URL with the given text and returns a list of Documents created based on the given text.

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


## Language Detect ***

---
#### *Path*
```textmate
POST /api/langdetect
```
#### *Description*
An endpoint for predicting a list of languages used inside the input texts. 

## Named-entity Recognition ***

---
#### *Path*
```textmate
POST /api/ner
```
#### *Description*
An endpoint for recognizing entities that are present in a given text document.
Return the list of entities.

Named Entity Recognition NER works by locating and identifying the named entities present in unstructured text into the standard categories such as person names, locations, organizations, time expressions, quantities, monetary values, percentage, codes etc.

*Example of return:*
```json
[{
  "end": 5, 
  "entity": "B-ORG",
  "index": 1,
  "score": 0.9973650574684143,
  "start": 1,
  "word": ""
}]
```
## Named-entity Recognition Spacy ***

---
#### *Path*
```textmate
POST /api/ner-spacy
```
#### *Description*
Endpoint for Named-entity Recognition using Spacy that has a fast statistical entity recognition system.
Receives a list of texts and returns a list of documents containing the predicted entities.


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
 Based on a given text, on a split size and on a number_of_questions to be generated, it generates maximum number_of_questions pairs (question, answer).

## Semantically Re-ranked ElasticSearch queries

---
#### *Path*
```textmate
POST /api/_search
```
#### *Description*

 A drop-in replacement of an ElasticSearch endpoint that can re-rank normal full-text queries.


## Similarity ***

---
#### *Path*
```textmate
POST /api/similarity
```
#### *Description*
Endpoint for computing the textual similarity between given text and a list of candidates texts.

Returns:

>* a list of predictions containing the cosine similarity score of texts.
>* a list of clusters of texts obtained by hierarchical clustering bottom up approach.


## Zeroshot Classifier ***

---
#### *Path*
```textmate
POST /api/zeroshot
```
#### *Description*
Endpoint for predicting the label of a text based on given list of candidate labels. 
It observes the candidate labels and predicts what is the list of labels and prediction score for the given text.
Any combination of sequences and labels can be passed and each combination will be posed as a premise/hypothesis pair.

##### Example:
*Given* 
>text = `Apple just announced the newest iPhone X`  
>label candidates = ['technology', 'politics', 'sports']

*Return a list of labels* 
```json
[ 
  {"label": "technology", "score": 0.9663877487182617},
  {"label": "sports", "score": 0.015614871867001057},
  {"label": "politics", "score": 0.017997432500123978} 
]
```




