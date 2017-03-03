const path = require('path');
const hbs = require('hbs');
const fs = require('fs');

const logger = require('./logging')('admin:http');
const express = require('express');
const config = require('./config');

exports.start = () => {
  const app = express();

  app.set('view engine', 'html');
  app.engine('html', require('hbs').__express);

  registerPartial('header');
  registerPartial('footer');

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

function registerPartial (name) {
  const content = fs.readFileSync(path.join(__dirname, 'partials', `${name}.html`), {encoding: 'utf8'});
  hbs.registerPartial(name, content);
}
