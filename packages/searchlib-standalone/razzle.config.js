const path = require('path');

const searchlibPath = path.normalize(path.join(require.resolve('@eeacms/search'), './../../src'));

module.exports = {
  modifyWebpackOptions({
    env: {
      target, // the target 'node' or 'web'
      dev, // is this a development build? true or false
    },
    options: {
      webpackOptions, // the default options that will be used to configure webpack/ webpack loaders and plugins
    }
  }) {
    // webpackOptions.notNodeExternalResMatch = (request, context) => {
    //   return /@eeacms\/search/.test(request)
    // };
    webpackOptions.babelRule.include = webpackOptions.babelRule.include.concat([
      /@eeacms\/search/,
      searchlibPath
    ]);
    return webpackOptions;
  },
  modifyWebpackConfig({
    webpackConfig, // the created webpack config
    webpackObject, // the imported webpack node module
    options: {
      razzleOptions, // the modified options passed to Razzle in the `options` key in `razzle.config.js` (options: { key: 'value'})
      webpackOptions, // the modified options that will be used to configure webpack/ webpack loaders and plugins
    },
    paths, // the modified paths that will be used by Razzle.
  }) {

    webpackConfig.resolve.alias['@eeacms/search'] = searchlibPath;

    return webpackConfig;
  }
}
