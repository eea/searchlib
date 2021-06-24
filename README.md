# EEA Semantic Search

This package contains libraries and demo code for the EEA Semantic Search
service.

We use [pnpm](https://pnpm.io) as package manager, so make sure to install that
first, with:

```
npm install -g pnpm
```

### Run the demo

Run:

```
pnpm install
pnpm build
pnpm start
```

### Develop the searchlib for a classic Plone addon

Run:

```
pnpm install
pnpm build
pnpm yalc-publish
```

Then, inside your classic Plone addon, in a create-react-app application, run:

```
npx yalc add @eeacms/search
```

### Run the standalone version

Run:

```
pnpm install
pnpm standalone
```

To connect the standalone version with EEA Global Search configuration, run it with:

```
env RAZZLE_ES_INDEX=global-search RAZZLE_APP_NAME=globalsearch pnpm run start
```

## Indexing and other related projects

- [Airflow Crawler custom code](https://github.com/eea/eea-crawler)
- [Airflow Crawler docker image](https://github.com/eea/eea.docker.airflow)
