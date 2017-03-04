const logger = require('./logging')('admin:http');
const pretty = require('express-prettify');
const express = require('express');
const config = require('./config');
const path = require('path');
const hbs = require('hbs');

exports.start = () => {
  const app = express();

  app.use(pretty({query: 'pretty'}));

  configureLocals(app);
  configureTemplating(app);
  configureStaticAssets(app);
  configurePluginRoutes(app);

  app.listen(config.http.port, config.http.bindAddress, () => {
    logger.info('admin interface available via http://%s:%s', config.http.bindAddress, config.http.port);
  });
};

function configureLocals (app) {
  app.locals.plugins = config.plugins;
  app.locals.navigationItems = buildNavigationItems();
}

function buildNavigationItems () {
  const navigationItems = [];

  config.plugins.forEach(plugin => {
    plugin.navigationItems.forEach(navigationItem => {
      navigationItems.push(navigationItem);
    });
  });

  navigationItems.sort((a, b) => {
    if (a.href === '/') {
      return -1;
    }
    return a.label.localeCompare(b.label);
  });

  return navigationItems;
}

function configureTemplating (app) {
  app.set('view engine', 'html');
  app.engine('html', require('hbs').__express);

  hbs.registerPartials(path.join(__dirname, 'partials'));
}

function configurePluginRoutes (app) {
  if (config.plugins.length === 0) {
    logger.warn('No plugin registered for admin interface.');
  }
  config.plugins.forEach(plugin => {
    app.use(plugin.mountPath, plugin.router);
  });
}

function configureStaticAssets (app) {
  const nodeModules = path.join(__dirname, '..', 'node_modules');
  app.use('/assets/admin', express.static(path.join(__dirname, 'assets')));
  app.use('/assets/bootstrap', express.static(path.join(nodeModules, 'bootstrap', 'dist')));
  app.use('/assets/bootswatch/paper', express.static(path.join(nodeModules, 'bootswatch', 'paper')));
  app.use('/assets/prism', express.static(path.join(nodeModules, 'prismjs')));
}
