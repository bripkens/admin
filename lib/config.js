const {defaultsDeep} = require('lodash');

const defaultOptions = {
  plugins: [],
  http: {
    bindAddress: '127.0.0.1',
    port: 2999
  }
};

module.exports = exports = {};

exports.applyUserConfig = config => {
  defaultsDeep(exports, config, defaultOptions);
};
