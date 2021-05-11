const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PostCssFlexBugFixes = require('postcss-flexbugs-fixes');
const postcssLoadConfig = require('postcss-load-config');

const hasPostCssConfig = () => {
  try {
    return !!postcssLoadConfig.sync();
  } catch (_error) {
    return false;
  }
};

const defaultOptions = {
  postcss: {
    development: {
      sourceMap: true,
      ident: 'postcss',
    },
    production: {
      sourceMap: false,
      ident: 'postcss',
    },
    plugins: [
      PostCssFlexBugFixes,
      autoprefixer({
        flexbox: 'no-2009',
      }),
    ],
  },
  less: {
    development: {
      sourceMap: true,
    },
    production: {
      sourceMap: true,
    },
  },
  css: {
    development: {
      sourceMap: true,
      importLoaders: 2,
      modules: {
        auto: true,
        localIdentName: '[name]__[local]___[hash:base64:5]',
      },
    },
    production: {
      sourceMap: false,
      importLoaders: 1,
      modules: {
        auto: true,
        localIdentName: '[name]__[local]___[hash:base64:5]',
      },
    },
  },
  style: {},
};

module.exports = (config) => {
  const options = defaultOptions;
  const constantEnv = config.mode; // development
  const dev = constantEnv === 'development';
  const isServer = false;

  const styleLoader = {
    loader: require.resolve('style-loader'),
    options: options.style,
  };

  const cssLoader = {
    loader: require.resolve('css-loader'),
    options: options.css[constantEnv],
  };

  // resolveUrlLoader is not compatible with semantic-ui-react
  // See https://github.com/Semantic-Org/Semantic-UI-React/issues/3761
  // Maybe also https://github.com/Semantic-Org/Semantic-UI-React/issues/3844
  // const resolveUrlLoader = {
  //   loader: require.resolve('resolve-url-loader'),
  //   options: options.resolveUrl[constantEnv],
  // };

  const postCssLoader = {
    loader: require.resolve('postcss-loader'),
    options: hasPostCssConfig()
    ? undefined
    : Object.assign({}, options.postcss[constantEnv], {
      plugins: () => options.postcss.plugins,
    }),
  };

  const lessLoader = {
    loader: require.resolve('less-loader'),
    options: Object.assign({}, options.less[constantEnv]),
  };

  config.module.rules = [
    ...config.module.rules,
    {
      test: /\.less$/,
      include: [
        path.resolve('./../demo'),
        path.resolve('./../demo/theme'),
        path.resolve('./../searchlib-less'),
        path.resolve('./src'),
        /node_modules\/@plone\/volto\/theme/,
        /plone\.volto\/theme/,
        /node_modules\/semantic-ui-less/,
        // ...Object.values(registry.getResolveAliases()),
      ],
      use: isServer
      ? [
        {
          loader: require.resolve('css-loader'),
          options: Object.assign({}, options.css[constantEnv], {
            onlyLocals: true,
          }),
        },
        // resolveUrlLoader,
        postCssLoader,
        lessLoader,
      ]
      : [
        dev ? styleLoader : MiniCssExtractPlugin.loader,
        cssLoader,
        postCssLoader,
        // resolveUrlLoader,
        lessLoader,
      ],
    },
  ];

  return config;

}
