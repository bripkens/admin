// Ensure that users of admin-plugin-profile don't get more than they bargained for.
// Specifically, we don't want heapdump to register its signal handlers.
if (process.env.NODE_HEAPDUMP_OPTIONS == null) {
  process.env.NODE_HEAPDUMP_OPTIONS = 'nosignal';
}
const heapdump = require('heapdump');

const router = require('express').Router();
const path = require('path');
const os = require('os');
const fs = require('fs');

let logger;

router.get('/', (req, res) => {
  res.render(path.join(__dirname, 'index.html'));
});

router.get('/heapdump', (req, res) => {
  const filename = `${Date.now()}.heapsnapshot`;
  const targetPath = path.join(os.tmpdir(), filename);
  logger.info('Heap dump initiated via admin endpoint. Collecting heap dump to %s', targetPath);

  heapdump.writeSnapshot(targetPath, err => {
    if (err) {
      logger.warn('Failed to write heap dump to disk', err)
      res.status(500).send(`Failed to write heap snapshot to ${targetPath}: ${err}`);
      attemptHeapdumpCleanup(targetPath);
      return;
    }

    logger.info('Heap dump written to disk, forwarding to user');
    res
      .set('Content-Disposition', `attachment; filename="${filename}"`)
      .set('Content-Type', 'text/plain')
      .sendFile(targetPath, err => {
        if (err) {
          logger.warn('Failed to send heap dump to user', err);
        }
        attemptHeapdumpCleanup(targetPath);
      });
  });
});

function attemptHeapdumpCleanup (path) {
  try {
    fs.unlinkSync(path);
  } catch (e) {
    if (err.code !== "ENOENT") {
      logger.warn('Failed to clean up heap dump at path %s', path, e);
    }
  }
}

module.exports = () => api => {
  logger = api.getLogger('admin-plugin-profile');

  return {
    name: 'index',
    mountPath: '/profile',
    navigationItems: [
      {
        href: '/profile',
        label: 'CPU / Heap Profiling'
      }
    ],
    router
  };
};
