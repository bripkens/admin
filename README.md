# admin &nbsp; [![Build Status](https://travis-ci.org/bripkens/admin.svg?branch=master)](https://travis-ci.org/bripkens/admin) [![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard) [![Greenkeeper badge](https://badges.greenkeeper.io/bripkens/admin.svg)](https://greenkeeper.io/)

Drop-in Node.js admin endpoint to help you analyze production issues.

**[Usage](#usage) |**
**[Plugins](PLUGINS.md) |**
**[Example project](examples/commonSetup) |**
**[Changelog](CHANGELOG.md)**

---

Running apps in production can be challenging. Applications may crash, run into bugs or get slow. There are a variety of ways to approach such issues. *Admin* is a tool to help troubleshoot application issues. It is designed to provide detailed debugging information about running Node.js apps.

Admin provides debugging endpoints via an HTTP server. The functionality provided by this server is extensible as admin is a [plugin system](PLUGINS.md).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [Usage](#usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Usage
To use admin, the [admin](https://www.npmjs.com/package/admin) Node.js package and at least one [plugin](PLUGINS.md) needs to be installed. The following example shows a typical setup.

```
npm install --save admin admin-plugin-index admin-plugin-report admin-plugin-profile admin-plugin-config admin-plugin-healthcheck
```

```javascript
const admin = require('admin');

admin.configure({
  http: { // optional
    bindAddress: '127.0.0.1', // default
    port: 2999 // default
  },

  plugins: [
    require('admin-plugin-index')(),
    require('admin-plugin-report')(),
    require('admin-plugin-profile')(),
    require('admin-plugin-config')({
      // An application config goes here. This config object will be
      // visible in the admin UI and via the admin REST endpoints.
      secret: '42',
      port: 8080
    }),
    require('admin-plugin-healthcheck')({
      checks: {
        // Define multiple healthchecks which check critical components
        // in the system. The following example shows valid return values.
        random() {
          const v = Math.random();
          if (v > 0.8) {
            throw new Error('Random value >0.8');
          } else if (v > 0.3) {
            return "Healthy like an application that isn't used.";
          } else {
            return Promise.reject('Something bad happened here…');
          }
        }
      }
    })
  ]
});

admin.start();
```
