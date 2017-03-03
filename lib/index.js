const config = require('./config');
const http = require('./http');

exports.configure = userConfig => config.applyUserConfig(userConfig || {});

exports.start = () => {
  http.start();
};
