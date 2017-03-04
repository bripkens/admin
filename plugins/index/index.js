const router = require('express').Router();
const path = require('path');

router.get('/', (req, res) => {
  res.render(path.join(__dirname, 'index.html'));
});

module.exports = () => () => {
  return {
    name: 'index',
    mountPath: '/',
    navigationItems: [
      {
        href: '/',
        label: 'Index'
      }
    ],
    router
  };
};
