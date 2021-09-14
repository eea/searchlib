const pkg = require('./package.json');

const path = require('path');

const nodeExternals = require('webpack-node-externals');

const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const babelConfig = require('./babel.config');
const lessPlugin = require('./webpack-less-plugin');

const plugins = [];

if (process.env.BUNDLE_ANALYZE) {
  plugins.push(new BundleAnalyzerPlugin());
}

const baseConfig = {
  plugins,
  entry: {
    index: `${__dirname}/src/index.js`,
  },
  target: 'node',
  output: {
    library: pkg.name,
    libraryTarget: 'commonjs2',
    path: `${__dirname}/dist`,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@eeacms/search': path.resolve('./../searchlib/src'),
    },
    // mainFields: ['main', 'module'], // https://github.com/webpack/webpack/issues/5756#issuecomment-405468106
  },
  devtool: 'source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelConfig,
          },
        ],
      },

      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  externals: [
    'react',
    'react-dom',
    'regenerator-runtime',
    'luxon',
    'superagent',
    'react-select',
    'semantic-ui-react',
    // nodeExternals({
    //   allowlist: [
    //     /\.(eot|woff|woff2|ttf|otf)$/,
    //     /\.(svg|png|jpg|jpeg|gif|ico)$/,
    //     /\.(mp4|mp3|ogg|swf|webp)$/,
    //     /\.(css|scss|sass|sss|less)$/,
    //   ],
    // }),
  ], //  ['react', 'react-dom']
};
module.exports = lessPlugin(baseConfig);

// "build": "yarn build-csj && yarn build-es && yarn build-esm && yarn build-umd",
// "build-cjs": "BABEL_ENV=production LIB_BABEL_ENV=cjs yarn babel --root-mode upward src --ignore */*.test.js,**/*.test.js,*/*.stories.js,**/stories.js --out-dir dist/cjs",
// "build-esm": "BABEL_ENV=production LIB_BABEL_ENV=esm yarn babel --root-mode upward src --ignore */*.test.js,**/*.test.js,*/*.stories.js,**/stories.js --out-dir dist/esm",
// "build-es": "BABEL_ENV=production LIB_BABEL_ENV=es yarn babel --root-mode upward src --ignore */*.test.js,**/*.test.js,*/*.stories.js,**/stories.js --out-dir dist/es",
// "build-umd": "webpack --mode=production"
