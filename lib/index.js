const pluginApi = require('./pluginApi');
const config = require('./config');
const http = require('./http');

exports.configure = userConfig => {
  config.applyUserConfig(userConfig || {});
  config.plugins = config.plugins
    // allow null / undefined to be listed as a plugin such that ternary
    // expressions can be used to easily enable / disable plugins, e.g.
    // plugins: [(IS_HEROKU) ? require('admin-plugin-terminate')() : null]
    .filter(pluginInitializer => pluginInitializer != null)
    .map(pluginInitializer => pluginInitializer(pluginApi));
};

exports.start = () => {
  http.start();
};
