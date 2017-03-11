const router = require('express').Router();
const path = require('path');
const os = require('os');
const fs = require('fs');

module.exports = () => api => {
  const logger = api.getLogger('admin-plugin-profile');

  let profiler;
  try {
    profiler = require('@risingstack/v8-profiler');
  } catch (e) {
    logger.error('v8-profiler could not be loaded. Will not expose profiling endpoints', e);
    return {
      name: 'profile',
      mountPath: '/profile',
      navigationItems: [],
      router
    };
  }

  router.get('/', (req, res) => {
    res.render(path.join(__dirname, 'index.html'));
  });

  router.get('/heapdump', (req, res) => {
    const filename = `${Date.now()}.heapsnapshot`;
    const targetPath = path.join(os.tmpdir(), filename);
    logger.info('Heap dump initiated via admin endpoint. Collecting heap dump to %s', targetPath);

    const snapshot = profiler.takeSnapshot();
    snapshot.export()
      .pipe(fs.createWriteStream(targetPath))
      .on('error', err => {
        logger.warn('Failed to write heap dump to disk', err);
        res.status(500).send(`Failed to write heap snapshot to ${targetPath}: ${err}`);
        attemptHeapdumpCleanup(targetPath);
        snapshot.delete();
      })
      .on('finish', () => {
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
        snapshot.delete();
      });
  });

  function attemptHeapdumpCleanup (path) {
    try {
      fs.unlinkSync(path);
    } catch (e) {
      if (e.code !== 'ENOENT') {
        logger.warn('Failed to clean up heap dump at path %s', path, e);
      }
    }
  }

  return {
    name: 'profile',
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
