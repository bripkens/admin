# admin &nbsp; [![Build Status](https://travis-ci.org/bripkens/admin.svg?branch=master)](https://travis-ci.org/bripkens/admin) [![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg)](https://github.com/Flet/semistandard) [![Greenkeeper badge](https://badges.greenkeeper.io/bripkens/admin.svg)](https://greenkeeper.io/)

Drop-in Node.js admin endpoint to help you analyze production issues.

**[Live Demo](https://limitless-brushlands-15811.herokuapp.com/) |**
**[Usage](#usage) |**
**[FAQ](#faq) |**
**[Plugins](PLUGINS.md) |**
**[Example project](example/commonSetup) |**
**[Changelog](CHANGELOG.md)**

---

Running apps in production can be challenging. Applications may crash, run into bugs or get slow. There are a variety of ways to approach such issues. *Admin* is a tool to help troubleshoot application issues. It is designed to provide detailed debugging information about running Node.js apps.

Admin provides debugging endpoints via an HTTP server. The functionality provided by this server is extensible as admin is a [plugin system](PLUGINS.md).

**Instead of describing this at length, check out the [live demo system](https://limitless-brushlands-15811.herokuapp.com/) on Heroku!**

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [Installation](#installation)
- [Usage](#usage)
- [FAQ](#faq)
  - [How do I inspect the admin UI when it only binds to localhost?](#how-do-i-inspect-the-admin-ui-when-it-only-binds-to-localhost)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Installation
To use admin, the [admin](https://www.npmjs.com/package/admin) Node.js package and at least one [plugin](PLUGINS.md) needs to be installed. The following example shows a typical setup.

```
npm install --save admin \
  admin-plugin-config \
  admin-plugin-healthcheck \
  admin-plugin-environment \
  admin-plugin-index \
  admin-plugin-profile \
  admin-plugin-report \
  admin-plugin-terminate
```

## Usage
To use admin, it needs to be configured and started with your application. The folowing code listing shows how this can be done.

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
    require('admin-plugin-environment')(),
    require('admin-plugin-profile')(),
    require('admin-plugin-terminate')(),
    require('admin-plugin-config')({
      config: {
        // An application config goes here. This config object will be
        // visible in the admin UI and via the admin REST endpoints.
        secret: '42',
        port: 8080
      }
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

## FAQ

### How do I inspect the admin UI when it only binds to localhost?
The easiest solution is to setup an SSH tunnel to the machine:

```
SSH_KEY="~/.ssh/<my_key>"
REMOTE_USER="<user>"
REMOTE_HOST="<host>"
ADMIN_PORT="<port>"

ssh -i "$SSH_KEY" -Nf -L "$ADMIN_PORT:localhost:$ADMIN_PORT" "$REMOTE_USER@$REMOTE_HOST"
curl "localhost:$ADMIN_PORT"
```
