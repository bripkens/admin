const nodereport = require('node-report/api');
const router = require('express').Router();
const path = require('path');

router.get('/', (req, res) => {
  if (req.accepts('html')) {
    res.render(path.join(__dirname, 'index.html'), {
      report: nodereport.getReport()
    });
  } else {
    res.send(nodereport.getReport());
  }
});

module.exports = () => {
  return {
    name: 'report',
    mountPath: '/report',
    router
  };
};
