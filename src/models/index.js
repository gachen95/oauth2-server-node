const mongoose = require('mongoose');
const config = require('../config');
const OAuth = require('./oauth');
const User = require('./oauth_user');
const Client = require('./oauth_client');

// set Promise provider to bluebird
mongoose.Promise = require('bluebird');

mongoose.connect(
  config.db,
  {
    useCreateIndex: true,
    useNewUrlParser: true
  }
);

module.exports.OAuth = OAuth;
module.exports.OAuthUser = User;
module.exports.OAuthClient = Client;
module.exports.mongoose = mongoose;
