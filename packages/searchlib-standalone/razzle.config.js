const path = require('path');

module.exports = {
  modifyWebpackConfig({ webpackConfig }) {
    webpackConfig.resolve.alias['../../theme.config$'] =
      path.resolve(`./theme/theme.config`);

    return webpackConfig;
  },
  plugins: ['less'],
};
