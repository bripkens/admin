const router = require('express').Router();
const path = require('path');

let config = null;

router.get('/', (req, res) => {
  if (req.accepts('html')) {
    res.render(path.join(__dirname, 'index.html'), {
      config: JSON.stringify(config, 0, 2)
    });
  } else {
    res.json(config);
  }
});

module.exports = _config => () => {
  config = _config;
  return {
    name: 'config',
    mountPath: '/config',
    navigationItems: [
      {
        href: '/config',
        label: 'Application Configuration'
      }
    ],
    router
  };
};
