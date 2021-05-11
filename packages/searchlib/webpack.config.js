const pack = require('./package.json');
const path = require('path');

const babelConfig = require('./babel.config');
console.log('src', path.resolve('./src'));

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@eeacms/search': path.resolve('./src'),
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
    ],
  },

  entry: `${__dirname}/src/index.js`,
  output: {
    library: pack.name,
    libraryTarget: 'umd',
    path: `${__dirname}/dist`,
    filename: 'index.js',
  },
};
