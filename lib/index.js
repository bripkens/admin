const config = require('./config');
const http = require('./http');

exports.start = userConfig => {
  config.applyUserConfig(userConfig || {});
  http.start();
};
