# Configuration

One of the goals of the Searchlib is that it's easy to integrate and manage
with various system and even allow through the web customizations, so we should
be able to serialize the configuration as JSON. To make that possible, we
split the configuration in two parts: the "app configuration" and the
"live registry" with component registrations.

## The Configuration singleton

To access the configuration object, you can simply import it as a singleton:

```jsx
import registry from '@eeacms/search/registry';
```

This config object has two parts:

  - `searchui`, which should be JSON-serializable. This is an object where each
    key is an "appConfig". The "base" configuration is the `default`, but you
    should derive each configuration branch from one of the existing branches
    (so at least derive from `default`)
  - `resolve`, which is a mapping of names to React components.

You should register components in `registry.resolve` and point to these
components using plain strings from the "app configuration" branch.


## The application configuration

Each application needs to use just a single branch of the `registry.searchui`
configuration object. This is achieved by passing the config registry and the
app name:

```jsx
import registry from '@eeacms/search/registry';
import installDemo from './demo';

const demoRegistry = installDemo(registry);

ReactDOM.render(
  <SearchApp registry={demoRegistry} appName="wise" />,
  document.getElementById('root'),
);
```

Check the [demo](https://github.com/eea/searchlib/tree/main/packages/demo)
package for more details.

## Runtime configuration

You should probably configure `config.host` and `config.elastic_index`;
