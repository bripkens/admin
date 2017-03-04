const nodeReport = require('node-report/api');
const router = require('express').Router();
const path = require('path');

router.get('/', (req, res) => {
  if (req.accepts('html')) {
    res.render(path.join(__dirname, 'index.html'), {
      report: nodeReport.getReport()
    });
  } else {
    res.send(nodeReport.getReport());
  }
});

module.exports = () => () => {
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
