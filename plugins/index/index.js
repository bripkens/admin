const eventLoopLag = require('event-loop-lag');
const prettyBytes = require('pretty-bytes');
const router = require('express').Router();
const path = require('path');
const fs = require('fs');

let metricInterval = null;
let lag = null;
let message = fs.readFileSync(path.join(__dirname, 'defaultMessage.html'), {encoding: 'utf8'});

router.get('/', (req, res) => {
  res.render(path.join(__dirname, 'index.html'), {
    message,
    metricInterval,
    pid: process.pid
  });
});

router.get('/index/metrics/lag', (req, res) => res.json((Math.round(lag() * 1000) / 1000) + 'ms'));
router.get('/index/metrics/rss', (req, res) => res.json(prettyBytes(process.memoryUsage().rss)));
router.get('/index/metrics/heap', (req, res) => {
  const memoryUsage = process.memoryUsage();
  res.json(`${prettyBytes(memoryUsage.heapUsed)} / ${prettyBytes(memoryUsage.heapTotal)}`);
});

module.exports = opts => () => {
  opts = opts || {};
  metricInterval = typeof opts.metricInterval === 'number' ? opts.metricInterval : 1000;
  lag = eventLoopLag(metricInterval);

  if (typeof opts.message === 'string') {
    message = opts.message;
  }

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
