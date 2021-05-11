const path = require('path');
const lessPlugin = require('./webpack-less-plugin');

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  "webpackFinal": async (config) => {
    config.resolve.alias['@eeacms/search'] = path.join(__dirname, './../src');
    config.resolve.alias['@eeacms/search'] = path.join(__dirname, './../src');
    config.resolve.alias['../../theme.config'] = path.resolve(__dirname, '../../demo/theme/theme.config');
    config.resolve.alias['../../theme.config$'] = path.resolve(__dirname, '../../demo/theme/theme.config');

    lessPlugin(config);
    console.log('config', config);
    console.log(config.module.rules[config.module.rules.length -1]);
    return config;
  }

}
