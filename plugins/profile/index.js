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
        attemptCleanup(targetPath);
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
            attemptCleanup(targetPath);
          });
        snapshot.delete();
      });
  });

  router.get('/cpu', (req, res) => {
    const filename = `${Date.now()}.cpuprofile`;
    const targetPath = path.join(os.tmpdir(), filename);
    logger.info('CPU profiling initiated via admin endpoint. Collecting profile to %s', targetPath);

    profiler.startProfiling(filename, true);

    setTimeout(() => {
      const profile = profiler.stopProfiling(filename);
      profile.export()
        .pipe(fs.createWriteStream(targetPath))
        .on('error', err => {
          logger.warn('Failed to write CPU profile to disk', err);
          res.status(500).send(`Failed to write CPU profile to ${targetPath}: ${err}`);
          attemptCleanup(targetPath);
          profile.delete();
        })
        .on('finish', () => {
          logger.info('CPU profile written to disk, forwarding to user');
          res
            .set('Content-Disposition', `attachment; filename="${filename}"`)
            .set('Content-Type', 'text/plain')
            .sendFile(targetPath, err => {
              if (err) {
                logger.warn('Failed to send CPU profile to user', err);
              }
              attemptCleanup(targetPath);
            });
          profile.delete();
        });
    }, 10000);
  });

  function attemptCleanup (path) {
    try {
      fs.unlinkSync(path);
    } catch (e) {
      if (e.code !== 'ENOENT') {
        logger.warn('Failed to clean up profiling file at path %s', path, e);
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
