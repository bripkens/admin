const express = require('express');
const config = require('./config');
const logger = require('./logging')('admin:http');

exports.start = () => {
  const app = express();

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.listen(config.http.port, config.http.bindAddress, () => {
    logger.info('admin interface available via http://%s:%s', config.http.bindAddress, config.http.port);
  });
};
