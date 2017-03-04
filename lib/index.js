const pluginApi = require('./pluginApi');
const config = require('./config');
const http = require('./http');

exports.configure = userConfig => {
  config.applyUserConfig(userConfig || {});
  config.plugins = config.plugins.map(pluginInitializer => pluginInitializer(pluginApi));
};

exports.start = () => {
  http.start();
};
