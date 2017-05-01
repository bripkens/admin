const logger = require('get-logger')('admin:http');
const pretty = require('express-prettify');
const express = require('express');
const config = require('./config');
const path = require('path');
const hbs = require('hbs');

exports.start = () => {
  const app = express();

  app.get('/favicon.png', (req, res) => res.sendFile(path.join(__dirname, 'assets', 'favicon.png')));
  app.use(pretty({query: 'pretty'}));
  app.use((req, res, next) => {
    if (typeof req.query.json !== 'undefined') {
      req.headers.accept = 'application/json';
    }
    next();
  });

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
  app.use('/assets/admin', express.static(path.join(__dirname, 'assets')));
  app.use('/assets/bootstrap', express.static(path.join(getLibBaseDir('bootstrap'), 'dist')));
  app.use('/assets/prism', express.static(getLibBaseDir('prismjs')));
  app.use('/assets/jquery', express.static(path.join(getLibBaseDir('jquery'), 'dist')));

  // bootswatch doesn't define an entrypoint in its package.json. Which is why we cannot rely
  // on require.resolve.
  const modulePath = path.join(getLibBaseDir('bootstrap'), '..');
  app.use('/assets/bootswatch/paper', express.static(path.join(modulePath, 'bootswatch', 'paper')));
}

function getLibBaseDir (name) {
  const resolvedPath = require.resolve(name);
  const segments = resolvedPath.split(path.sep);
  for (let i = 0; i < segments.length; i++) {
    if (segments[i] === 'node_modules' && segments[i + 1] === name) {
      return segments.slice(0, i + 2).join(path.sep);
    }
  }

  throw new Error(`Failed to identify lib base dir for lib ${name}. Resolved dir: ${resolvedPath}`);
}
