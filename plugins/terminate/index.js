const router = require('express').Router();
const path = require('path');

const exitDelay = 2000;
let logger;

router.get('/', (req, res) => {
  res.render(path.join(__dirname, 'index.html'), {
    exitDelay
  });
});

router.post('/execute', (req, res) => {
  logger.info('Terminating Node.js process as requested via admin-plugin-terminate in %sms.', exitDelay);
  res.send(`Terminating in ${exitDelay}ms`);
  setTimeout(() => {
    process.exit(0);
  }, exitDelay);
});

module.exports = () => api => {
  logger = api.getLogger('admin-plugin-terminate');

  return {
    name: 'terminate',
    mountPath: '/terminate',
    navigationItems: [
      {
        href: '/terminate',
        label: 'Terminate'
      }
    ],
    router
  };
};
