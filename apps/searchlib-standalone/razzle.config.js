const path = require('path');

module.exports = {
  modifyWebpackOptions({
    env: {
      target, // the target 'node' or 'web'
      dev, // is this a development build? true or false
    },
    options: {
      webpackOptions, // the default options that will be used to configure webpack/ webpack loaders and plugins
    },
  }) {
    // webpackOptions.notNodeExternalResMatch = (request, context) => {
    //   return /@eeacms\/search/.test(request);
    // };
    webpackOptions.babelRule.include = webpackOptions.babelRule.include.concat([
      /@eeacms\/search/,
      /@eeacms\/search-middleware/,
      /@eeacms\/globalsearch/,
    ]);
    return webpackOptions;
  },
  modifyWebpackConfig({ webpackConfig }) {
    webpackConfig.resolve.alias['../../theme.config$'] =
      path.resolve(`./theme/theme.config`);
    webpackConfig.resolve.alias['@package'] = path.resolve(`./src`);

    return webpackConfig;
  },
  plugins: ['less'],
};
