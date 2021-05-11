"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _appConfig = require("./appConfig");

Object.keys(_appConfig).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _appConfig[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _appConfig[key];
    }
  });
});