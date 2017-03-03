const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('Welcome!');
});

module.exports = ({mountAsRoot=true}={}) => {
  return {
    name: 'index',
    mountPath: mountAsRoot ? '/' : '/index',
    router
  };
};
