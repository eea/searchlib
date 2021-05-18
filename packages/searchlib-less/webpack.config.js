const path = require('path');
const webpack = require('webpack'); //to access built-in plugins
const lessPlugin = require('./webpack-less-plugin');

const makeConfig = () => (
  {
    mode: 'production',
    entry: './semantic-ui.less',
    output: {
      // filename: 'bundle.css',
      path: path.resolve(__dirname, 'dist')
    },

    // webpack-dev-server config for refreshing and more
    devServer: {
      contentBase: './dist',
    },

    resolve: {
      alias: {
        '../../theme.config': path.resolve('theme/theme.config'),
        '@eeacms/search-less': __dirname,
      }
    },

    //In order to import a CSS file from within a JavaScript module
    module: {
      rules: [
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader'
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            'file-loader'
          ]
        }
      ]
    },
    plugins: []
  }
);

const config = lessPlugin(makeConfig());
module.exports = config;
