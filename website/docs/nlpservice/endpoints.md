# NLPService Endpoints

## Sentence Embedding

---
>#### *PATH*
```textmate
POST /api/embedding
```

>#### *Description*
A sentence or passage embedding service. It uses two models, one suitable for long text (passages) and one for short text (queries).

> #### Request body
```json 
{
  "is_passage": false,
  "snippets": [
    "Maritime transport plays and will continue to play an essential role in global and European trade and economy.",
    "The European Environment Agency provides sound, independent information on the environment for those involved in developing, adopting, implementing and evaluating environmental policy, and also the general public.",
    "Climate-friendly practices for sourcing raw materials hold significant potential to cut greenhouse gas emissions in Europe and globally."
  ]
}
```

> #### Response body (Sample)
```json
{
  "embeddings": [
    {
      "text": "Maritime transport plays and will continue to play an essential role in global and European trade and economy.",
      "embedding": [
        -0.01635344699025154,
        -0.21518361568450928,
        0.6456935405731201,
        0.2299184948205948,
        0.44873157143592834,
        0.20109005272388458,
        -0.030237190425395966,
        0.3279860317707062
      ]
    }
  ]
}
```


> #### Curl
```shell
curl -X 'POST' \
  'http://<NLPService URL>>/api/embedding' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "is_passage": false,
  "snippets": [
    "Maritime transport plays and will continue to play an essential role in global and European trade and economy.",
    "The European Environment Agency provides sound, independent information on the environment for those involved in developing, adopting, implementing and evaluating environmental policy, and also the general public.",
    "Climate-friendly practices for sourcing raw materials hold significant potential to cut greenhouse gas emissions in Europe and globally."
  ]
}'
```


## Feedback

---
>#### *PATH*
```textmate
POST, GET, DELETE /api/feedback
```

>#### *Description*
An endpoint to allow users to write feedback and correct classification on documents.
This endpoint allows the API user to submit feedback on an answer for a particular query.
For example, the user can send feedback on whether the answer was correct and whether the right snippet was identified as the answer.
Information submitted through this endpoint is used to train the underlying QA model.


> #### POST Request body
```json 
{
  "answer": "string",
  "question": "string",
  "context": "string",
  "document_id": "string",
  "score": 0,
  "is_correct_answer": true,
  "is_correct_document": true,
  "no_answer": true,
  "offsets_in_context": [
    "string"
  ],
  "offsets_in_document": [
    "string"
  ],
  "origin": "user-feedback",
  "meta": {}
}
```

> #### POST Response body
```json
{
  "status": "ok"
}
```

> #### Curl
```shell
curl -X 'POST' \
  'http://<NLPService URL>/api/feedback' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "answer": "string",
  "question": "string",
  "context": "string",
  "document_id": "string",
  "score": 0,
  "is_correct_answer": true,
  "is_correct_document": true,
  "no_answer": true,
  "offsets_in_context": [
    "string"
  ],
  "offsets_in_document": [
    "string"
  ],
  "origin": "user-feedback",
  "meta": {}
}'
```

>>GET /api/feedback
>
>This endpoint allows the API user to retrieve ``ALL`` the feedback that has been submitted through the
> ``POST`` 

>>DELETE /api/feedback
>
>This endpoint allows the API user to delete ``ALL`` the feedback that has been sumbitted through the 
> ``POST``


## Language Detect

---
>#### *PATH*
```textmate
POST /api/langdetect
```

>#### *Description*
An endpoint for predicting a list of languages used inside a given text. 

> #### Request body
```json 
 {
  "texts": [
    "With 77 % of European external trade and 35 % of all trade by value between EU Member States moved by sea, maritime transport is a key part of the international supply chain. Despite a drop in shipping activity in 2020 due to the effects of the COVID-19 pandemic, the sector is expected to grow strongly over the coming decades, fueled by rising demand for primary resources and container shipping.\n\nAgainst this background, the European Maritime Transport Environmental Report, launched today by the European Environment Agency and the European Maritime Safety Agency, marks the first comprehensive health-check of the sector. The report shows that ships produce 13.5 % of all greenhouse gas emissions from transport in the EU, behind emissions from road transport (71 %) and aviation (14.4 %). Sulphur dioxide (SO2) emissions from ships calling in European ports amounted to approximately 1.63 million tonnes in 2019, a figure which is expected to fall further over the coming decades due to stricter environmental rules and measures.\n\nMaritime transport is estimated to have contributed to the fact that underwater noise levels in EU waters have more than doubled between 2014 and 2019 and has been responsible for half of all non-indigenous species introduced into European seas since 1949. However, even though the volume of oil transported by sea has been steadily increasing, only eight accidental medium to large oil tanker spills out of a worldwide total of 62 occurred in EU waters over the past decade.\n\nThe joint report assesses the current state of emerging maritime transport sustainability solutions, including alternative fuels, batteries and onshore power supply, and provides a comprehensive picture of their uptake in the EU. It also outlines future challenges posed by climate change for the industry, including the potential impact of rising sea levels on ports.\n\n“Our Sustainable and Smart Mobility Strategy makes clear that all transport modes need to become more sustainable, smarter and more resilient —  including shipping. Although maritime transport has improved its environmental footprint in past years, it still faces big challenges when it comes to decarbonising and reducing pollution. Based on all the latest evidence, our policies aim to help the sector confront these challenges, by making the most of innovative solutions and digital technologies. This way, maritime transport can keep growing and delivering on our citizens’ daily needs, in harmony with the environment, all the while maintaining its competitiveness and continuing to create quality jobs,” said Adina Vălean, EU Commissioner for Transport.\n\n“This joint report gives us an excellent overview of the present and future challenges related to maritime transport. The message is clear: maritime transport is expected to increase in the coming years and unless we act now, the sector will produce more and more greenhouse gas emissions, air pollutants and underwater noise. A smooth but rapid transition of the sector is crucial to meet the objectives of the European Green Deal and move towards carbon neutrality. This will also create new economic opportunities for the European transport industry as part of the necessary transition to a sustainable blue economy. The challenge is immense, but we have the technologies, the resources and the will to tackle it, said Virginijus Sinkevičius, European Commissioner for Environment, Oceans and Fisheries."
  ],
  "options": {
    "debug": false
  }
}
```

> #### Response body

```json
{
  "predictions": [
    "en"
  ]
}
```

> #### Curl
```shell
curl -X 'POST' \
  'http://<NLPService URL>/api/langdetect' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "texts": [
    "With 77 % of European external trade and 35 % of all trade by value between EU Member States moved by sea, maritime transport is a key part of the international supply chain. Despite a drop in shipping activity in 2020 due to the effects of the COVID-19 pandemic, the sector is expected to grow strongly over the coming decades, fueled by rising demand for primary resources and container shipping.\n\nAgainst this background, the European Maritime Transport Environmental Report, launched today by the European Environment Agency and the European Maritime Safety Agency, marks the first comprehensive health-check of the sector. The report shows that ships produce 13.5 % of all greenhouse gas emissions from transport in the EU, behind emissions from road transport (71 %) and aviation (14.4 %). Sulphur dioxide (SO2) emissions from ships calling in European ports amounted to approximately 1.63 million tonnes in 2019, a figure which is expected to fall further over the coming decades due to stricter environmental rules and measures.\n\nMaritime transport is estimated to have contributed to the fact that underwater noise levels in EU waters have more than doubled between 2014 and 2019 and has been responsible for half of all non-indigenous species introduced into European seas since 1949. However, even though the volume of oil transported by sea has been steadily increasing, only eight accidental medium to large oil tanker spills out of a worldwide total of 62 occurred in EU waters over the past decade.\n\nThe joint report assesses the current state of emerging maritime transport sustainability solutions, including alternative fuels, batteries and onshore power supply, and provides a comprehensive picture of their uptake in the EU. It also outlines future challenges posed by climate change for the industry, including the potential impact of rising sea levels on ports.\n\n“Our Sustainable and Smart Mobility Strategy makes clear that all transport modes need to become more sustainable, smarter and more resilient —  including shipping. Although maritime transport has improved its environmental footprint in past years, it still faces big challenges when it comes to decarbonising and reducing pollution. Based on all the latest evidence, our policies aim to help the sector confront these challenges, by making the most of innovative solutions and digital technologies. This way, maritime transport can keep growing and delivering on our citizens’ daily needs, in harmony with the environment, all the while maintaining its competitiveness and continuing to create quality jobs,” said Adina Vălean, EU Commissioner for Transport.\n\n“This joint report gives us an excellent overview of the present and future challenges related to maritime transport. The message is clear: maritime transport is expected to increase in the coming years and unless we act now, the sector will produce more and more greenhouse gas emissions, air pollutants and underwater noise. A smooth but rapid transition of the sector is crucial to meet the objectives of the European Green Deal and move towards carbon neutrality. This will also create new economic opportunities for the European transport industry as part of the necessary transition to a sustainable blue economy. The challenge is immense, but we have the technologies, the resources and the will to tackle it, said Virginijus Sinkevičius, European Commissioner for Environment, Oceans and Fisheries."
  ],
  "options": {
    "debug": false
  }
}'
```

## Named-entity Recognition

---
>#### *PATH*
```textmate
POST /api/ner
```

>#### *Description*
An endpoint for recognizing entities that are present in a given text document.
Return the list of entities.
Named Entity Recognition NER works by locating and identifying the named entities present in unstructured text into the standard categories such as person names, locations, organizations, time expressions, quantities, monetary values, percentage, codes etc.


> #### Request body 
```json 
{
  "texts": [
    "EEA Executive Director Hans Bruyninckx welcomed President Čaputová and her delegation, which also included Andrej Doležal, Slovakia’s Minister of Transport and Construction. The Executive Director thanked the President for Slovakia’s strong commitment to the EU’s environmental goals and explained how the EEA is working to provide reliable data and information to policymakers - specifically in supporting the European Green Deal and accompanying legislation, which aims to shift Europe towards a sustainable, low-carbon future."
  ]
}
```


> #### Response body (Sample)
```json
{
  "entities": [
    [
      {
        "entity": "B-ORG",
        "score": 0.9998663663864136,
        "index": 1,
        "word": "E",
        "start": 1,
        "end": 1
      },
      {
        "entity": "B-ORG",
        "score": 0.9998698234558105,
        "index": 2,
        "word": "EA",
        "start": 1,
        "end": 3
      },
      {
        "entity": "B-PER",
        "score": 0.9997484087944031,
        "index": 5,
        "word": "Hans",
        "start": 23,
        "end": 27
      }
    ]
  ]
}
```

> #### Curl
```shell
curl -X 'POST' \
  'http://<NLPService URL>/api/ner' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "texts": [
    "EEA Executive Director Hans Bruyninckx welcomed President Čaputová and her delegation, which also included Andrej Doležal, Slovakia’s Minister of Transport and Construction. The Executive Director thanked the President for Slovakia’s strong commitment to the EU’s environmental goals and explained how the EEA is working to provide reliable data and information to policymakers - specifically in supporting the European Green Deal and accompanying legislation, which aims to shift Europe towards a sustainable, low-carbon future."
  ]
}'
```


## Named-entity Recognition Spacy

---
>#### *PATH*
```textmate
POST /api/ner-spacy
```

>#### *Description*
Endpoint for Named-entity Recognition using Spacy that has a fast statistical entity recognition system.
Receives a list of texts and returns a list of documents containing the predicted entities.


> #### Request body
```json 
{
  "texts": [
    "With 77 % of European external trade and 35 % of all trade by value between EU Member States moved by sea, maritime transport is a key part of the international supply chain. Despite a drop in shipping activity in 2020 due to the effects of the COVID-19 pandemic, the sector is expected to grow strongly over the coming decades, fueled by rising demand for primary resources and container shipping.\n\nAgainst this background, the European Maritime Transport Environmental Report, launched today by the European Environment Agency and the European Maritime Safety Agency, marks the first comprehensive health-check of the sector. The report shows that ships produce 13.5 % of all greenhouse gas emissions from transport in the EU, behind emissions from road transport (71 %) and aviation (14.4 %). Sulphur dioxide (SO2) emissions from ships calling in European ports amounted to approximately 1.63 million tonnes in 2019, a figure which is expected to fall further over the coming decades due to stricter environmental rules and measures.\n\nMaritime transport is estimated to have contributed to the fact that underwater noise levels in EU waters have more than doubled between 2014 and 2019 and has been responsible for half of all non-indigenous species introduced into European seas since 1949. However, even though the volume of oil transported by sea has been steadily increasing, only eight accidental medium to large oil tanker spills out of a worldwide total of 62 occurred in EU waters over the past decade.\n\nThe joint report assesses the current state of emerging maritime transport sustainability solutions, including alternative fuels, batteries and onshore power supply, and provides a comprehensive picture of their uptake in the EU. It also outlines future challenges posed by climate change for the industry, including the potential impact of rising sea levels on ports.\n\n“Our Sustainable and Smart Mobility Strategy makes clear that all transport modes need to become more sustainable, smarter and more resilient —  including shipping. Although maritime transport has improved its environmental footprint in past years, it still faces big challenges when it comes to decarbonising and reducing pollution. Based on all the latest evidence, our policies aim to help the sector confront these challenges, by making the most of innovative solutions and digital technologies. This way, maritime transport can keep growing and delivering on our citizens’ daily needs, in harmony with the environment, all the while maintaining its competitiveness and continuing to create quality jobs,” said Adina Vălean, EU Commissioner for Transport.\n\n“This joint report gives us an excellent overview of the present and future challenges related to maritime transport. The message is clear: maritime transport is expected to increase in the coming years and unless we act now, the sector will produce more and more greenhouse gas emissions, air pollutants and underwater noise. A smooth but rapid transition of the sector is crucial to meet the objectives of the European Green Deal and move towards carbon neutrality. This will also create new economic opportunities for the European transport industry as part of the necessary transition to a sustainable blue economy. The challenge is immense, but we have the technologies, the resources and the will to tackle it, said Virginijus Sinkevičius, European Commissioner for Environment, Oceans and Fisheries."
  ]
}
```


> #### Response body (sample)
```json
{
  "documents": [
    {
      "text": "With 77 % of European external trade and 35 % of all trade by value between EU Member States moved by sea, maritime transport is a key part of the international supply chain. Despite a drop in shipping activity in 2020 due to the effects of the COVID-19 pandemic, the sector is expected to grow strongly over the coming decades, fueled by rising demand for primary resources and container shipping.\n\nAgainst this background, the European Maritime Transport Environmental Report, launched today by the European Environment Agency and the European Maritime Safety Agency, marks the first comprehensive health-check of the sector. The report shows that ships produce 13.5 % of all greenhouse gas emissions from transport in the EU, behind emissions from road transport (71 %) and aviation (14.4 %). Sulphur dioxide (SO2) emissions from ships calling in European ports amounted to approximately 1.63 million tonnes in 2019, a figure which is expected to fall further over the coming decades due to stricter environmental rules and measures.\n\nMaritime transport is estimated to have contributed to the fact that underwater noise levels in EU waters have more than doubled between 2014 and 2019 and has been responsible for half of all non-indigenous species introduced into European seas since 1949. However, even though the volume of oil transported by sea has been steadily increasing, only eight accidental medium to large oil tanker spills out of a worldwide total of 62 occurred in EU waters over the past decade.\n\nThe joint report assesses the current state of emerging maritime transport sustainability solutions, including alternative fuels, batteries and onshore power supply, and provides a comprehensive picture of their uptake in the EU. It also outlines future challenges posed by climate change for the industry, including the potential impact of rising sea levels on ports.\n\n“Our Sustainable and Smart Mobility Strategy makes clear that all transport modes need to become more sustainable, smarter and more resilient —  including shipping. Although maritime transport has improved its environmental footprint in past years, it still faces big challenges when it comes to decarbonising and reducing pollution. Based on all the latest evidence, our policies aim to help the sector confront these challenges, by making the most of innovative solutions and digital technologies. This way, maritime transport can keep growing and delivering on our citizens’ daily needs, in harmony with the environment, all the while maintaining its competitiveness and continuing to create quality jobs,” said Adina Vălean, EU Commissioner for Transport.\n\n“This joint report gives us an excellent overview of the present and future challenges related to maritime transport. The message is clear: maritime transport is expected to increase in the coming years and unless we act now, the sector will produce more and more greenhouse gas emissions, air pollutants and underwater noise. A smooth but rapid transition of the sector is crucial to meet the objectives of the European Green Deal and move towards carbon neutrality. This will also create new economic opportunities for the European transport industry as part of the necessary transition to a sustainable blue economy. The challenge is immense, but we have the technologies, the resources and the will to tackle it, said Virginijus Sinkevičius, European Commissioner for Environment, Oceans and Fisheries.",
      "ents": [
        {
          "start": 5,
          "end": 9,
          "label": "PERCENT"
        },
        {
          "start": 13,
          "end": 21,
          "label": "NORP"
        },
        {
          "id": 487,
          "start": 2768,
          "end": 2775
        }
      ]
    }
  ]
}
```

> #### Curl
```shell
curl -X 'POST' \
  'http://<NLPService URL>/api/ner-spacy' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "texts": [
    "With 77 % of European external trade and 35 % of all trade by value between EU Member States moved by sea, maritime transport is a key part of the international supply chain. Despite a drop in shipping activity in 2020 due to the effects of the COVID-19 pandemic, the sector is expected to grow strongly over the coming decades, fueled by rising demand for primary resources and container shipping.\n\nAgainst this background, the European Maritime Transport Environmental Report, launched today by the European Environment Agency and the European Maritime Safety Agency, marks the first comprehensive health-check of the sector. The report shows that ships produce 13.5 % of all greenhouse gas emissions from transport in the EU, behind emissions from road transport (71 %) and aviation (14.4 %). Sulphur dioxide (SO2) emissions from ships calling in European ports amounted to approximately 1.63 million tonnes in 2019, a figure which is expected to fall further over the coming decades due to stricter environmental rules and measures.\n\nMaritime transport is estimated to have contributed to the fact that underwater noise levels in EU waters have more than doubled between 2014 and 2019 and has been responsible for half of all non-indigenous species introduced into European seas since 1949. However, even though the volume of oil transported by sea has been steadily increasing, only eight accidental medium to large oil tanker spills out of a worldwide total of 62 occurred in EU waters over the past decade.\n\nThe joint report assesses the current state of emerging maritime transport sustainability solutions, including alternative fuels, batteries and onshore power supply, and provides a comprehensive picture of their uptake in the EU. It also outlines future challenges posed by climate change for the industry, including the potential impact of rising sea levels on ports.\n\n“Our Sustainable and Smart Mobility Strategy makes clear that all transport modes need to become more sustainable, smarter and more resilient —  including shipping. Although maritime transport has improved its environmental footprint in past years, it still faces big challenges when it comes to decarbonising and reducing pollution. Based on all the latest evidence, our policies aim to help the sector confront these challenges, by making the most of innovative solutions and digital technologies. This way, maritime transport can keep growing and delivering on our citizens’ daily needs, in harmony with the environment, all the while maintaining its competitiveness and continuing to create quality jobs,” said Adina Vălean, EU Commissioner for Transport.\n\n“This joint report gives us an excellent overview of the present and future challenges related to maritime transport. The message is clear: maritime transport is expected to increase in the coming years and unless we act now, the sector will produce more and more greenhouse gas emissions, air pollutants and underwater noise. A smooth but rapid transition of the sector is crucial to meet the objectives of the European Green Deal and move towards carbon neutrality. This will also create new economic opportunities for the European transport industry as part of the necessary transition to a sustainable blue economy. The challenge is immense, but we have the technologies, the resources and the will to tackle it, said Virginijus Sinkevičius, European Commissioner for Environment, Oceans and Fisheries."
  ]
}'
```


## Question and Answer

---
>#### *PATH*
```textmate
POST /api/query
```

>#### *Description*
Based on the search term query, it extracts answers from the ES results.

> #### Request body 
```json 
{
  "query": "What is GHG",
  "params": {
    "use_dp": true,
    "custom_query": {},
    "RawRetriever": {},
    "DensePassageRetriever": {},
    "AnswerExtraction": {}
  }
}
```


> #### Response body (Sample)
```json
{
  "query": "string",
  "answers": [
    {
      "answer": "string",
      "text": "string",
      "body": "string",
      "question": "string",
      "score": 0,
      "probability": 0,
      "context": "string",
      "full_context": "string",
      "offset_start": 0,
      "offset_end": 0,
      "offset_start_in_doc": 0,
      "offset_end_in_doc": 0,
      "document_id": "string",
      "id": "string",
      "source": {},
      "meta": {},
      "original_answer": {}
    }
  ]
}
```

> #### Curl
```shell
curl -X 'POST' \
  'http://<NLPService URL>/api/query' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "query": "What is GHG",
  "params": {
    "use_dp": true,
    "custom_query": {},
    "RawRetriever": {},
    "DensePassageRetriever": {},
    "AnswerExtraction": {}
  }
}'
```


## Question Classifier

---
>#### *PATH*
```textmate
POST /api/query-classifier
```

>### **Description**
Common Query types
  ####  Keyword Queries:
  Such queries don't have semantic meaning, merely consist of keywords and the order of words does not matter:
> * arya stark father
> * jon snow country
> * arya stark younger brothers
> 
> 
  ####  Questions (Interrogative Queries):
  In such queries users ask a question in a complete, "natural" sentence.
  Regardless of the presence of "?" in the query the goal here is to detect the
  intent of the user whether any question is asked or not in the query:
 > * who is the father of arya stark?
 > * which country was jon snow filmed in
 > * who are the younger brothers of arya stark?
 > 
 > 
  ####  Statements (Declarative Queries):
  Such queries consist also of a regular, natural sentence with semantic
  relations between the words. However, they are rather a statement than
  a question:
 > * Arya stark was a daughter of a lord.
 > * Show countries that Jon snow was filmed in.
 > * List all brothers of Arya.

>>#### Interrogative Queries
>> #### Request body
```json 
{
  "query": "Where to go on holiday"
}
```
>>
>> #### Response body 
```json
{
  "answer": "query:interrogative"
}
```


>>####  Keyword Queries
>> #### Request body
```json 
{
  "query": "arya stark father"
}
```
>> #### Response body
```json
{
  "answer": "query:keyword"
}
```

>>#### Declarative Queries
>>#### Request body
```json 
{
  "query": "Arya stark was a daughter of a lord."
}
```
>>#### Response body
```json
{
  "answer": "query:declarative"
}
```

> #### Curl
```shell
curl -X 'POST' \
  'http://<NLPService URL>/api/query-classifier' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "query": "Where to go on holiday"
}'
```

 
## Question Generation

---
>#### *PATH*
```textmate
POST /api/questiongeneration
```

>#### *Description*
 Based on a given text, on a split size and on a number_of_questions to be generated, it generates maximum number_of_questions pairs (question, answer).

> #### Request body
```json 
{
  "num_questions": 2,
  "answer_style": "sentences",
  "text": "With 77 % of European external trade and 35 % of all trade by value between EU Member States moved by sea, maritime transport is a key part of the international supply chain. Despite a drop in shipping activity in 2020 due to the effects of the COVID-19 pandemic, the sector is expected to grow strongly over the coming decades, fueled by rising demand for primary resources and container shipping.\n\nAgainst this background, the European Maritime Transport Environmental Report, launched today by the European Environment Agency and the European Maritime Safety Agency, marks the first comprehensive health-check of the sector. The report shows that ships produce 13.5 % of all greenhouse gas emissions from transport in the EU, behind emissions from road transport (71 %) and aviation (14.4 %). Sulphur dioxide (SO2) emissions from ships calling in European ports amounted to approximately 1.63 million tonnes in 2019, a figure which is expected to fall further over the coming decades due to stricter environmental rules and measures.\n\nMaritime transport is estimated to have contributed to the fact that underwater noise levels in EU waters have more than doubled between 2014 and 2019 and has been responsible for half of all non-indigenous species introduced into European seas since 1949. However, even though the volume of oil transported by sea has been steadily increasing, only eight accidental medium to large oil tanker spills out of a worldwide total of 62 occurred in EU waters over the past decade.\n\nThe joint report assesses the current state of emerging maritime transport sustainability solutions, including alternative fuels, batteries and onshore power supply, and provides a comprehensive picture of their uptake in the EU. It also outlines future challenges posed by climate change for the industry, including the potential impact of rising sea levels on ports.\n\n“Our Sustainable and Smart Mobility Strategy makes clear that all transport modes need to become more sustainable, smarter and more resilient —  including shipping. Although maritime transport has improved its environmental footprint in past years, it still faces big challenges when it comes to decarbonising and reducing pollution. Based on all the latest evidence, our policies aim to help the sector confront these challenges, by making the most of innovative solutions and digital technologies. This way, maritime transport can keep growing and delivering on our citizens’ daily needs, in harmony with the environment, all the while maintaining its competitiveness and continuing to create quality jobs,” said Adina Vălean, EU Commissioner for Transport.\n\n“This joint report gives us an excellent overview of the present and future challenges related to maritime transport. The message is clear: maritime transport is expected to increase in the coming years and unless we act now, the sector will produce more and more greenhouse gas emissions, air pollutants and underwater noise. A smooth but rapid transition of the sector is crucial to meet the objectives of the European Green Deal and move towards carbon neutrality. This will also create new economic opportunities for the European transport industry as part of the necessary transition to a sustainable blue economy. The challenge is immense, but we have the technologies, the resources and the will to tackle it, said Virginijus Sinkevičius, European Commissioner for Environment, Oceans and Fisheries."
}
```

> #### Response body
```json
{
  "text": "With 77 % of European external trade and 35 % of all trade by value between EU Member States moved by sea, maritime transport is a key part of the international supply chain. Despite a drop in shipping activity in 2020 due to the effects of the COVID-19 pandemic, the sector is expected to grow strongly over the coming decades, fueled by rising demand for primary resources and container shipping.\n\nAgainst this background, the European Maritime Transport Environmental Report, launched today by the European Environment Agency and the European Maritime Safety Agency, marks the first comprehensive health-check of the sector. The report shows that ships produce 13.5 % of all greenhouse gas emissions from transport in the EU, behind emissions from road transport (71 %) and aviation (14.4 %). Sulphur dioxide (SO2) emissions from ships calling in European ports amounted to approximately 1.63 million tonnes in 2019, a figure which is expected to fall further over the coming decades due to stricter environmental rules and measures.\n\nMaritime transport is estimated to have contributed to the fact that underwater noise levels in EU waters have more than doubled between 2014 and 2019 and has been responsible for half of all non-indigenous species introduced into European seas since 1949. However, even though the volume of oil transported by sea has been steadily increasing, only eight accidental medium to large oil tanker spills out of a worldwide total of 62 occurred in EU waters over the past decade.\n\nThe joint report assesses the current state of emerging maritime transport sustainability solutions, including alternative fuels, batteries and onshore power supply, and provides a comprehensive picture of their uptake in the EU. It also outlines future challenges posed by climate change for the industry, including the potential impact of rising sea levels on ports.\n\n“Our Sustainable and Smart Mobility Strategy makes clear that all transport modes need to become more sustainable, smarter and more resilient —  including shipping. Although maritime transport has improved its environmental footprint in past years, it still faces big challenges when it comes to decarbonising and reducing pollution. Based on all the latest evidence, our policies aim to help the sector confront these challenges, by making the most of innovative solutions and digital technologies. This way, maritime transport can keep growing and delivering on our citizens’ daily needs, in harmony with the environment, all the while maintaining its competitiveness and continuing to create quality jobs,” said Adina Vălean, EU Commissioner for Transport.\n\n“This joint report gives us an excellent overview of the present and future challenges related to maritime transport. The message is clear: maritime transport is expected to increase in the coming years and unless we act now, the sector will produce more and more greenhouse gas emissions, air pollutants and underwater noise. A smooth but rapid transition of the sector is crucial to meet the objectives of the European Green Deal and move towards carbon neutrality. This will also create new economic opportunities for the European transport industry as part of the necessary transition to a sustainable blue economy. The challenge is immense, but we have the technologies, the resources and the will to tackle it, said Virginijus Sinkevičius, European Commissioner for Environment, Oceans and Fisheries.",
  "questions": [
    {
      "question": "How many accidental medium to large oil spills occurred in the past decade?",
      "answer": "However, even though the volume of oil transported by sea has been steadily increasing, only eight accidental medium to large oil tanker spills out of a worldwide total of 62 occurred in EU waters over the past decade."
    },
    {
      "question": "What is the first comprehensive health-check of the maritime transport sector?",
      "answer": "</s> Against this background, the European Maritime Transport Environmental Report, launched today by the European Environment Agency and the European Maritime Safety Agency, marks the first comprehensive health-check of the sector."
    }
  ]
}
```

> #### Curl
```shell
curl -X 'POST' \
  'http://<NLPService URL>/api/questiongeneration' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "num_questions": 2,
  "answer_style": "sentences",
  "text": "With 77 % of European external trade and 35 % of all trade by value between EU Member States moved by sea, maritime transport is a key part of the international supply chain. Despite a drop in shipping activity in 2020 due to the effects of the COVID-19 pandemic, the sector is expected to grow strongly over the coming decades, fueled by rising demand for primary resources and container shipping.\n\nAgainst this background, the European Maritime Transport Environmental Report, launched today by the European Environment Agency and the European Maritime Safety Agency, marks the first comprehensive health-check of the sector. The report shows that ships produce 13.5 % of all greenhouse gas emissions from transport in the EU, behind emissions from road transport (71 %) and aviation (14.4 %). Sulphur dioxide (SO2) emissions from ships calling in European ports amounted to approximately 1.63 million tonnes in 2019, a figure which is expected to fall further over the coming decades due to stricter environmental rules and measures.\n\nMaritime transport is estimated to have contributed to the fact that underwater noise levels in EU waters have more than doubled between 2014 and 2019 and has been responsible for half of all non-indigenous species introduced into European seas since 1949. However, even though the volume of oil transported by sea has been steadily increasing, only eight accidental medium to large oil tanker spills out of a worldwide total of 62 occurred in EU waters over the past decade.\n\nThe joint report assesses the current state of emerging maritime transport sustainability solutions, including alternative fuels, batteries and onshore power supply, and provides a comprehensive picture of their uptake in the EU. It also outlines future challenges posed by climate change for the industry, including the potential impact of rising sea levels on ports.\n\n“Our Sustainable and Smart Mobility Strategy makes clear that all transport modes need to become more sustainable, smarter and more resilient —  including shipping. Although maritime transport has improved its environmental footprint in past years, it still faces big challenges when it comes to decarbonising and reducing pollution. Based on all the latest evidence, our policies aim to help the sector confront these challenges, by making the most of innovative solutions and digital technologies. This way, maritime transport can keep growing and delivering on our citizens’ daily needs, in harmony with the environment, all the while maintaining its competitiveness and continuing to create quality jobs,” said Adina Vălean, EU Commissioner for Transport.\n\n“This joint report gives us an excellent overview of the present and future challenges related to maritime transport. The message is clear: maritime transport is expected to increase in the coming years and unless we act now, the sector will produce more and more greenhouse gas emissions, air pollutants and underwater noise. A smooth but rapid transition of the sector is crucial to meet the objectives of the European Green Deal and move towards carbon neutrality. This will also create new economic opportunities for the European transport industry as part of the necessary transition to a sustainable blue economy. The challenge is immense, but we have the technologies, the resources and the will to tackle it, said Virginijus Sinkevičius, European Commissioner for Environment, Oceans and Fisheries."
}'
```




## Semantically Re-ranked ElasticSearch queries

---
>#### *PATH*
```textmate
POST /api/_search
```

>#### *Description*
 A drop-in replacement of an ElasticSearch endpoint that can re-rank normal full-text queries. 
 A service that combines search and QA.

> #### Request body
```json 
{
  "runtime_mappings": {},
  "from": 0,
  "query": {},
  "aggs": {},
  "highlight": {},
  "size": 10,
  "sort": [
    "string"
  ],
  "track_total_hits": true,
  "explain": false,
  "params": {},
  "source": {},
  "suggest": {},
  "index": "string"
}
```

> #### Response body
```text
a text
```

> #### Curl
```shell
curl -X 'POST' \
  'http://<NLPService URL>/api/_search' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "runtime_mappings": {},
  "from": 0,
  "query": {},
  "aggs": {},
  "highlight": {},
  "size": 10,
  "sort": [
    "string"
  ],
  "track_total_hits": true,
  "explain": false,
  "params": {},
  "source": {},
  "suggest": {},
  "index": "string"
}'
```

## Similarity

---
>#### *PATH*
```textmate
POST /api/similarity
```

>#### *Description*
Endpoint for computing the textual similarity between given text and a list of candidates texts.
Returns:
* a list of predictions containing the cosine similarity score of texts.
* a list of clusters of texts obtained by hierarchical clustering bottom up approach.

> #### Request body
```json 
{
  "base": "eight accidental medium to large oil tanker spills out of a worldwide total of 62 occurred in EU waters over the past decade",
  "candidates": [
    "underwater noise levels in EU waters have more than doubled between 2014 and 2019",
    "maritime transport can keep growing and delivering on our citizens’ daily needs, in harmony with the environment",
    "out of a total of 18 large accidental oil spills in the word since 2010, only three were located in the EU (17%)"
  ]
}
```

> #### Response body
```json
{
  "base": "string",
  "predictions": [
    {
      "text": "string",
      "score": 0
    }
  ],
  "clusters": [
    "string"
  ]
}
```

> #### Curl
```shell
curl -X 'POST' \
  'http://<NLPService URL>/api/similarity' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "base": "eight accidental medium to large oil tanker spills out of a worldwide total of 62 occurred in EU waters over the past decade",
  "candidates": [
    "underwater noise levels in EU waters have more than doubled between 2014 and 2019",
    "maritime transport can keep growing and delivering on our citizens’ daily needs, in harmony with the environment",
    "out of a total of 18 large accidental oil spills in the word since 2010, only three were located in the EU (17%)"
  ]
}'
```

## Zeroshot Classifier

---
>#### *PATH*
```text
POST /api/zeroshot
```

>#### *Description*
Endpoint for predicting the label of a text based on given list of candidate labels. 
It observes the candidate labels and predicts what is the list of labels and prediction score for the given text.
Any combination of sequences and labels can be passed and each combination will be posed as a premise/hypothesis pair.


> #### Request body
```json 
 {
	"text": "EU maritime transport faces a crucial decade to transition to a more economically, socially and environmentally sustainable sector. Already, most ships calling in the EU have reduced their speed by up to 20 % compared to 2008, thereby also reducing emissions, according to the report.",
	"candidate_labels": [
		"Air pollution",
		"Climate change",
		"Biodiversity",
		"Land use",
		"Water and marine environment",
		"Transport",
		"Industry",
		"Energy",
		"Agriculture"
	]
}
```

> #### Response body
```json
{
  "labels": [
    {
      "label": "Water and marine environment",
      "score": 0.17067378759384155
    },
    {
      "label": "Transport",
      "score": 0.695084810256958
    }
  ]
}
```


> #### Curl
```shell
curl -X 'POST' \
  'http://<NLPService URL>/api/zeroshot' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "text": "EU maritime transport faces a crucial decade to transition to a more economically, socially and environmentally sustainable sector. Already, most ships calling in the EU have reduced their speed by up to 20 % compared to 2008, thereby also reducing emissions, according to the report.",
  "candidate_labels": [
    "Air pollution",
    "Climate change",
    "Biodiversity",
    "Land use",
    "Water and marine environment",
    "Transport",
    "Industry",
    "Energy",
    "Agriculture"
  ]
}'
```

## Converter

---
>#### *PATH*
```textmate
POST /api/converter
```

>#### *Description*
Converts a text from a given URL into a list of Documents.
It receives a URL with the given text and returns a list of Documents created based on the given text.


> #### Request body
```json 
{
 "url": "https://www.eea.europa.eu/api/SITE/publications/exploring-the-social-challenges-of/at_download/file"
}
```

> #### Response body
```json
{
  "text" : "string",
  "id" : "string",
  "score": 0.6456678234,
  "meta": []
}
```

> #### Curl
```shell
curl -X 'POST' \
  'http://<NLPService URL>/api/converter' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
 "url": "https://www.eea.europa.eu/api/SITE/publications/exploring-the-social-challenges-of/at_download/file"
}'
```
