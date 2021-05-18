# Language features

Searchlib React uses a typical setup of React + Babel + Webpack. If you're
developing a React application powered by EEA Searchlib, you should integrate
a similar setup in your pipeline.

EEA Searchlib uses [semantic-ui-react](https://react.semantic-ui.com/theming)
for component library. As a consequence, you'll also have to integrate
semantic-ui CSS. An option is to use our prepackaged `@eeacms/search-less`
distribution, which provides only the basics that are needed from
semantic-ui-less.

In short, add `@eeacms/search-less` as dependency and
