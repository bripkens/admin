const {defaultsDeep} = require('lodash');

module.exports = exports = {
  plugins: [],
  http: {
    bindAddress: '127.0.0.1',
    port: 2999
  }
};

exports.applyUserConfig = config => {
  defaultsDeep(exports, config);
};
