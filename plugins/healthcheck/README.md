# admin-plugin-healthcheck &nbsp; [![Node.js admin plugin system](https://img.shields.io/badge/plugin-admin-brightgreen.svg)](https://github.com/bripkens/admin) [![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg)](https://github.com/Flet/semistandard)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [Installation](#installation)
- [Usage](#usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

```
npm install --save admin-plugin-healthcheck
```

## Usage

```javascript
admin.configure({
  plugins: [
    require('admin-plugin-healthcheck')({
      checks: {
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
```
