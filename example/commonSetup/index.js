const admin = require('admin');

admin.configure({
  plugins: [
    require('admin-plugin-index')(),
    require('admin-plugin-report')(),
  ]
});

admin.start();
