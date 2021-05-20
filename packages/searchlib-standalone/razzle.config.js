const makeLoaderFinder = require('razzle-dev-utils/makeLoaderFinder');
const path = require('path');

// const searchlibPath = path.normalize(path.join(require.resolve('@eeacms/search'), './../../src'));

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
    //   return /@eeacms\/search/.test(request)
    // };
    // webpackOptions.babelRule.include = webpackOptions.babelRule.include.concat([
    //   /@eeacms\/search/,
    //   searchlibPath
    // ]);
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
    // webpackConfig.resolve.alias['@eeacms/search'] = searchlibPath;
    // console.log(webpackConfig.module.rules);
    const cssLoaderFinder = makeLoaderFinder('css-loader');
    const cssLoader = webpackConfig.module.rules.find(cssLoaderFinder);

    const lessLoader = {
      loader: require.resolve('less-loader'),
      options: {
        dev: {
          sourceMap: true,
        },
        prod: {
          sourceMap: true,
        },
      },
    };

    const lessLoaderRule = {
      test: /\.less$/,
      include: [path.resolve('./theme'), /node_modules\/semantic-ui-less/],
      use: [lessLoader].concat(cssLoader.use),
    };

    // console.log(typeof lessLoaderRule.use);

    // console.log(webpackConfig);
    webpackConfig.module.rules = webpackConfig.module.rules.concat([
      lessLoaderRule,
    ]);
    return webpackConfig;
  },
};

// isServer
//   ? [
//       {
//         loader: require.resolve('css-loader'),
//         options: Object.assign({}, options.css[constantEnv], {
//           onlyLocals: true,
//         }),
//       },
//       // resolveUrlLoader,
//       postCssLoader,
//       lessLoader,
//     ]
//   : [
//       dev ? styleLoader : MiniCssExtractPlugin.loader,
//       cssLoader,
//       postCssLoader,
//       // resolveUrlLoader,
//       lessLoader,
//     ],
