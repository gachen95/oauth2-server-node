const nodeEnv = process.env.NODE_ENV || 'development';
const Development = require('./development');
const Production = require('./production');
const Mac = require('./mac');
const Test = require('./test');

const config = {
  development: Development,
  production: Production,
  mac: Mac,
  test: Test
};

module.exports = config[nodeEnv];
