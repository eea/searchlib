const path = require('path');
const rewireBabelLoader = require("craco-babel-loader");

const fs = require("fs");
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const searchlibPath = resolveApp("../searchlib");
const cracoExtendScope = require('@dvhb/craco-extend-scope');

console.log(searchlibPath);
const CracoAlias = require("craco-alias");


module.exports = {
  plugins: [
    { plugin: require('@semantic-ui-react/craco-less') },

    { plugin: rewireBabelLoader,
      options: {
        includes: [
          /@eeacms\/search/,
          searchlibPath,
        ], //put things you want to include in array here
        // excludes: [/(node_modules|bower_components)/] //things you want to exclude here
        //you can omit include or exclude if you only want
        //to use one option
      }
    },

    { plugin: cracoExtendScope, options: { path: searchlibPath} },

    {
      plugin: CracoAlias,
      options: {
        source: "jsconfig",
        // baseUrl SHOULD be specified
        // plugin does not take it from jsconfig
        // baseUrl: "./src"
      }
    }

  ],


  webpack: {
    alias: {
      "@eeacms/search": searchlibPath,    //path.resolve(__dirname, "../packages/searchlib/src")
    }
  },


  // babel: {
  //   // presets: [],
  //   // plugins: [],
  //   loaderOptions: { /* Any babel-loader configuration options: https://github.com/babel/babel-loader. */ },
  //   // loaderOptions: (babelLoaderOptions, { env, paths }) => { return babelLoaderOptions; }
  // },

  //   webpackOptions.babelRule.include = webpackOptions.babelRule.include.concat([
  //     /@eeacms\/search/,
  //     /@eeacms\/search-middleware/,
  //   ]);
  //   return webpackOptions;
  // },

}
