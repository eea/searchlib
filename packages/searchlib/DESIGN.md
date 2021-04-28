## Context

EEA needs a modern, flexible and generic search solution, one that is
platform-independent and that can scale from micro-small listings to
full-featured custom search engines.

We already have eea.searchserver.js which provides a solid and viable solution
for common operations such as indexing from various sources, index updating and
provides a public-facing Search UI. The problem is one of outdated techonology,
difficulties in expanding it and the need for domain-specific knowledge.

## Requirements

The Search Server UI should have the following characteristics:

- It should be a reusable component. It needs to be easily deployable as a separate app or integrated in other websites (Plone 4/5 classic, Volto).
- It should be easy to extend and contribute from many developer teams.
- In its most basic instance, it needs to function based on declarative configuration. With just configuration it should be possible to create complex search-level experiences (various facets, configurable listing views, autocomplete experience, etc). The idea is to make all the "special cases" part of the default library, so that it will grow its capabilities.
- The configuration can be passed as a JSON.
- It should allow multiple instances per website.
- It should function in conjunction with the indexing done in the EEA Search Server Harvester.

## Solution

The next generate EEA Semantic Search UI will be based on React, as it will
provide synergy with the rest of the active web development teams. React is the
most popular frontend framework and it has the benefit of having a large
support from many communities and vendors. The ElasticSearch corporation
already provides a library to integrate with their ElasticSearch servers and
that library will be used as the basis for our SearchUI solution.

ElasticSearch company's official ElasticSearch UI components are considered the
most future-proof base for our final product. The react-search-ui library
provides a set of "headless" virtual components with concrete implementation in
react-search-ui-views. It is a solid base, with code that is easy to
understand and we will start our implementation from there.

We will also draw inspiration and adopt or include implementations of search
components from other ES libraries:

- https://github.com/searchkit/searchkit
- https://github.com/appbaseio/reactivesearch
- https://github.com/appbaseio/searchbox


### Technology stack

  - React
  - react-search-ui
  - react-search-ui-views
  - EEA SemanticSearch monorepo

### Monorepo setup

To facilitate the development of a flexible package architecture, we will use
a monorepo setup. This means that the components and implementation shells will
be developed and run side by side, ensuring ease of development and testing.

The following packages will be part of the initial setup:

  - @eeacms/searchlib   - main library, React
  - @eeacms/searchlib-hierarchical-multifacet-x   - various addons
  - @eeacms/search-shell-react - Full-features standalone React app. Should be able to do SSR
  - @eeacms/search-shell-classic - Shell around the main library to use in plain Plone
  - @eeacms/search-shell-component - web component variant

Later, we may develop new package, such as:

  - @eeacms/searchlib-editor - TTW builder of Search Engine configuration

The monorepo setup will be based on NX https://nx.dev/.

We will integrate Storybook and use it as testing infrastructure for Cypress
End2End testing.

For documentation we will use Docusaurus https://docusaurus.io/


### Language infrastructure

Distribution and package setup:

  - use React/babel/webpack setup
  - all packages can be distributed as compiled libraries
  - To use the shells, include two distributed libs: main library + shell dist,
    then use from plan JS
  - main library can be used directly from React

## Principles

  - it should be possible to easily build a search engine using the high-level
    components of @eeacms/searchlib. At least as easy as w/ searchkit.
  - a singleton configuration registry with multiple "app configurations" that
    can inherit from each other
  - configuration should be serializable as JSON. This means registering
    components as named factories
  - named layouts should allow flexibility in how the search engine looks (can
    work as minimal "listing carousel" or maximal configuration)
  - use semantic-ui-react as an extra UI library
  - separate the search UI into clearly distinguishable abstract components
  - create reusable, configurable search widgets:
    - autocomplete searchbox
    - filterable searchbox
    - "selected filters"
    - facets
      - hierarchical
      - combo
      - daterange
      - facetlist
      - listfacet
      - rangeslider
    - pagination
    - results
      - table
      - listing
      - cards
    - details page for results
    - sorting
    - buttons
    - intro page
    - etc.
  - Start with react-searchui-views as component library
  - Don't impose certain indexing structure. Allow custom vocabularies, allow
    loading these vocabularies async. Provide vocabularies as i18n-aware vocabs
    in JSON?
