# Theming searchlib

To ensure future compatibility with Volto application, we use
[Semantic-UI-LESS](https://github.com/Semantic-Org/Semantic-UI-LESS)
as the theming engine, together with
[Semantic-UI-React](https://react.semantic-ui.com/) as the component
library.

If your destination-product is not based on Semantic-UI, you can use
a precompiled CSS file, available in the `packages/searchlib-less/dist/main.css`

If you already use Semantic-UI-LESS, then include the
`packages/searchlib-less/theme.less` file.

You can also compile your own semantic-ui-less CSS. You'll have to create
a `semantic-ui.less` file, customize it to include only the base definitions
that you need and also create a `theme.config` file (don't forget to setup its
webpack alias as `../../theme.config`. See the `demo` package or
`searchlib-standalone` on details on how that can be done.
