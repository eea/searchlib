# Integrate with classic Plone

You can treat searchlib as a simple React library.

Add it as a dependency:

```
yarn add @eeacms/search
```

If you're developing the EEA Searchlib at the same time, run:

```
git clone https://github.com/eea/searchlib
cd searchlib
pnpm build
pnpm yalc-publish
```

Then, inside your Plone package:

```
yarn link-searchlib
yarn build
```

See [wise.theme Catalogue of Measures](https://github.com/eea/wise.theme/tree/plone5/src/wise/theme/search)
search for an example.
