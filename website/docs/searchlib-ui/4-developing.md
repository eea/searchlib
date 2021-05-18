# Developing Searchlib-UI

Searchlib is developed as a React library.

To be able to "demo" and develop it, we have the `packages/demo` package.

To run it, run:

```bash
npm install -g pnpm
pnpm install
pnpm build
pnpm start
```

To facilitate development we have some sample datasets that are integrated with
ElasticSearch.

### Catalogue of measures

See the [catalogue of measures](https://github.com/eea/searchlib/tree/main/sampledata/catalogue-of-measures) folder.
It contains docker-compose services with ElasticSearch, indexer and CSV files.
