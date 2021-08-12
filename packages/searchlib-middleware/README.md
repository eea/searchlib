See website/docs/searchlib-ui/standalone.md for details on how to configure the
proxy.

If you need to run the middleware as a standalone server, you can use the
following example:

```
// import React from 'react';    // needed for inclusion in bundle
import runtime from 'regenerator-runtime/runtime'; // compatibility with react-speech-recognition

import {registry} from '@eeacms/search';
import {makeServer} from '@eeacms/search-middleware';
import installConfig from './config';

console.log('runtime', runtime);
const configRegistry = installConfig(registry);

const app = makeServer(configRegistry);
const port = process.env.PORT || '7000';

app.listen(port, () => {
  console.log(`ES Proxy app running on http://localhost:${port}`)
})
```
