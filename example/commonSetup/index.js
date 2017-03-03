const admin = require('admin');

admin.configure({
  plugins: [
    require('admin-plugin-index')(),
    require('admin-plugin-report')(),
    require('admin-plugin-config')({
      secret: '42',
      port: 8080
    })
  ]
});

admin.start();
