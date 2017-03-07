const router = require('express').Router();
const path = require('path');

router.get('/', (req, res) => {
  if (req.accepts('html')) {
    res.render(path.join(__dirname, 'index.html'), {
      env: JSON.stringify(process.env, 0, 2)
    });
  } else {
    res.json(process.env);
  }
});

module.exports = opts => () => {
  return {
    name: 'environment',
    mountPath: '/environment',
    navigationItems: [
      {
        href: '/environment',
        label: 'Environment'
      }
    ],
    router
  };
};
