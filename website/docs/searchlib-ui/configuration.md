# Configuration

One of the goals of the Searchlib is that it's easy to integrate and manage
with various system and even allow through the web customizations, so we should
be able to serialize the configuration as JSON. To make that possible, we'll
split the configuration in two parts: the "app configuration" and the
"live registry" with component registrations.

## The Configuration object

This config object has two parts:

  - `searchui`, which should be JSON-serializable. This is an object where each
    key is an "appConfig". The "base" configuration is the `default`, but you
    should derive each configuration branch from one of the existing branches
    (so at least derive from `default`)
