const router = require('express').Router();
const Promise = require('bluebird');
const path = require('path');

let logger;

// name => function which returns a promise
let checks = {};

router.get('/', (req, res) => {
  getHealthCheckResult()
    .then(result => {
      res.status(isHealthcheckCompletelyHealthy(result) ? 200 : 500);

      if (req.accepts('html')) {
        res.render(path.join(__dirname, 'index.html'), {
          result: JSON.stringify(result, 0, 2)
        });
      } else {
        res.json(result);
      }
    })
    .catch(err => {
      logger.error('Failed to run healthchecks', err);
      res.sendStatus(500);
    });
});

module.exports = opts => api => {
  logger = api.getLogger('admin-plugin-healthcheck');

  if (opts && opts.checks) {
    checks = opts.checks;
  }

  return {
    name: 'healthcheck',
    mountPath: '/healthcheck',
    navigationItems: [
      {
        href: '/healthcheck',
        label: 'Healthchecks'
      }
    ],
    router
  };
};

function getHealthCheckResult () {
  const checkNames = Object.keys(checks);
  const checkResultPromises = checkNames
    .map(name =>
      runCheck(checks[name])
        .timeout(20000)
        .then(data => {
          return {
            healthy: true,
            data
          };
        })
        .catch(error => {
          // Looks like an error, reformat so that JSON serialization works reliably.
          if (error.message && error.stack) {
            error = {
              message: error.message,
              stack: error.stack
            };
          }
          return {
            healthy: false,
            data: error
          };
        })
    );

  return Promise.all(checkResultPromises)
    .then(checkResults => {
      return checkResults.reduce((result, checkResult, i) => {
        result[checkNames[i]] = checkResult;
        return result;
      }, {});
    });
}

function runCheck (checker) {
  try {
    return Promise.resolve(checker());
  } catch (e) {
    return Promise.reject(e);
  }
}

function isHealthcheckCompletelyHealthy (healthcheckResult) {
  return Object.keys(healthcheckResult)
    .reduce((healthy, name) => healthy && healthcheckResult[name].healthy, true);
}
