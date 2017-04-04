const admin = require('admin');
const metrics = require('measured').createCollection();

const isPublicDemo = process.env.IS_DEMO === 'true';

metrics.gauge('memory.rss', () => process.memoryUsage().rss);
metrics.gauge('event-loop-lag', require('event-loop-lag')(1000));

admin.configure({
  http: {
    bindAddress: '0.0.0.0',
    port: parseInt(process.env.PORT || 2999, 10)
  },

  plugins: [
    require('admin-plugin-index')(),
    require('admin-plugin-report')(),
    require('admin-plugin-environment')(),
    require('admin-plugin-profile')(),
    require('admin-plugin-measured')({collection: metrics}),
    isPublicDemo ? null : require('admin-plugin-terminate')(),
    require('admin-plugin-config')({
      config: {
        secret: '42',
        port: 8080
      }
    }),
    require('admin-plugin-healthcheck')({
      checks: {
        random() {
          metrics.meter('healthCheckCalls').mark();
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
