---
sidebar_position: 1
---

# Introduction

EEA Semantic Search uses Airflow to run indexing. Airflow uses the "DAG" as
a name for the Directed Acyclical Graphs objects that represent a complex
pipeline of tasks. In this documentation we'll use the "workflow" terminology,
as that term is more familiar, DAG being a term focused more on the developers.

## Common workflows

### Automatically trigger reindexing of websites

This workflow is triggered automatically every 12 hours. It reads a list of
websites configured as an Airflow variable. Each website should provide
a sitemap.xml.gz file that lists available pages. Each website should also
provide a preferred crawled method (restapi/html parsing crawler). Initially we
will only implement restapi crawler.

### Crawl a Plone restapi website

This task knows how to crawl a plone.restapi website. That means retrieving the
sitemap and creating fetch tasks for each page. An additional task is to expire
pages that no longer exist in the current index.

We will need a database of all the pages. It should include things like:

- Website
- Page URL
- Last crawl status
- Last crawl address
- Crawl history (+ details table)

The crawl history details table will be automatically vacuumed to include only
the last 5 entries for each page.

Each website needs to have a webmaster email adress, which will be used for
notifications. Each website will get its own "administration" page where
statistics on the indexed pages will be presented.

### Harvest a page

A fetched URL resource is used as the input in a data harvesting DAG. Among
the tasks to be performed are: fields normalization, metadata enrichment and
final indexing.

## Task writing guidelines.

All tasks should define a version in their docs.
