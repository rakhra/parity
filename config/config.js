var fs = require('fs');
var path = require('path');
var NODE_ENV = process.env.NODE_ENV;
var configBuffer = null;

// Init config_buffer according to the NODE_ENV
switch (NODE_ENV) {
  case 'production':
    configBuffer = fs.readFileSync(path.resolve(__dirname, 'production.json'), 'utf-8');
    break;
  default:
    configBuffer = fs.readFileSync(path.resolve(__dirname, 'local.json'), 'utf-8');
}

var config = JSON.parse(configBuffer);
module.exports = config;