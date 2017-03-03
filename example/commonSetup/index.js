const admin = require('admin');

admin.configure({
  plugins: [
    require('admin-plugin-index')()
  ]
});

admin.start();
