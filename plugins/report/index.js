const router = require('express').Router();
const path = require('path');

module.exports = () => api => {
  const logger = api.getLogger('admin-plugin-report');

  let nodeReport;
  try {
    nodeReport = require('node-report/api');
  } catch (e) {
    logger.error('node-report could not be loaded. Will not expose reporting endpoint. Error: %s', e.message);
    return {
      name: 'report',
      mountPath: '/report',
      navigationItems: [],
      router
    };
  }

  router.get('/', (req, res) => {
    if (req.accepts('html')) {
      res.render(path.join(__dirname, 'index.html'), {
        report: nodeReport.getReport()
      });
    } else {
      res.send(nodeReport.getReport());
    }
  });

  return {
    name: 'report',
    mountPath: '/report',
    navigationItems: [
      {
        href: '/report',
        label: 'Diagnostic Summary'
      }
    ],
    router
  };
};
