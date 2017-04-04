const router = require('express').Router();
const path = require('path');

let collection = null;

router.get('/', (req, res) => {
  const metrics = typeof collection.name === 'object' ? collection.toJSON()[collection.name] : collection.toJSON();
  if (req.accepts('html')) {
    res.render(path.join(__dirname, 'index.html'), {
      metrics: JSON.stringify(metrics, 0, 2)
    });
  } else {
    res.json(metrics);
  }
});

module.exports = opts => () => {
  collection = opts.collection;
  return {
    name: 'measured',
    mountPath: '/measured',
    navigationItems: [
      {
        href: '/measured',
        label: 'Metrics (via measured)'
      }
    ],
    router
  };
};
