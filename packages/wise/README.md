## Wise Catalog of Measures


This application  uses the EEA Semantic Search library.

To test it, run:

```
git clone https://github.com/eea/searchlib
cd searchlib
yarn build
yarn yalc-publish
```

Then, inside this folder:

```
yarn link-searchlib
yarn build
```

Then go to [@@measures-search](http://localhost:8080/Plone/@@measures-search)
