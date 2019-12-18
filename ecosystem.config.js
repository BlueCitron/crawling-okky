const path = require('path');

module.exports = {
  apps : [{
    name: 'CRAWLING_OKKY',
    script: './src/index.js',
    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 1,
    autorestart: false,
    watch: false,
    max_memory_restart: '1G',
    log_file: path.resolve(__dirname, 'log/app.log'),
    error_file: path.resolve(__dirname, 'log/error.log'),
    time: true,
    env: {
      NODE_ENV: 'development'
    }
  }],
};
