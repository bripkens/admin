const logger = require('./logging')('admin:http');
const express = require('express');
const config = require('./config');

exports.start = () => {
  const app = express();

  if (config.plugins.length === 0) {
    logger.warn('No plugin registered for admin interface.');
  }
  config.plugins.forEach(plugin => {
    app.use(plugin.mountPath, plugin.router);
  });

  app.listen(config.http.port, config.http.bindAddress, () => {
    logger.info('admin interface available via http://%s:%s', config.http.bindAddress, config.http.port);
  });
};
