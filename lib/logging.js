'use strict';

const pino = require('pino');

let loggerProvider = pinoLoggerProvider;

module.exports = exports = function getLogger (name) {
  return loggerProvider(name);
};

exports.setLoggerProvider = function setLoggerProvider (provider) {
  loggerProvider = provider;
};

function pinoLoggerProvider (name) {
  return pino({name});
}
