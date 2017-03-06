# admin &nbsp; [![Build Status](https://travis-ci.org/bripkens/admin.svg?branch=master)](https://travis-ci.org/bripkens/admin) [![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

[![Greenkeeper badge](https://badges.greenkeeper.io/bripkens/admin.svg)](https://greenkeeper.io/)

Drop-in admin endpoint to help you analyze production issues.

---

## TODO
 - [x] download heap dump: https://github.com/bnoordhuis/node-heapdump/blob/master/README.md
 - [x] grab a Node report: https://github.com/nodejs/node-report/blob/master/README.md
 - [x] healthchecks
 - [x] Provide application config
 - [x] optional `?pretty` parameter for all JSON endpoints
 - [ ] download 10s CPU profile
 - [ ] metrics
 - [ ] see basic application metrics, e.g. event loop and garbage collection metrics, in a simple HTML view
 - [ ] change log level
 - [ ] disable duplicate log message filter

## document
 - pretty print
 - recommended bind address
 - typical setup
 - heap dump and cpu profile dangers, heap dump env var, cpu profile memory leak
