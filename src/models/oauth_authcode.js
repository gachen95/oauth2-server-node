const mongoose = require('mongoose');
// const Client = require('./oauth_client');
// const User = require('./oauth_user');

// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;
// eslint-disable-next-line prefer-destructuring
const ObjectId = Schema.Types.ObjectId;

const OAuthAuthCodeSchema = new Schema({
  auth_code: { type: String, required: true, unique: true },
  scope: String,
  expires_at: Date,
  redirect_uri: String,
  client: { type: ObjectId, ref: 'client' },
  user: { type: ObjectId, ref: 'user' }
});

mongoose.model('authcode', OAuthAuthCodeSchema);

const OAuthAuthCodeModel = mongoose.model('authcode');

module.exports.getAuthorizationCode = (authCode, callback) => {
  OAuthAuthCodeModel.findOne({ authCode }, callback);
};

module.exports.saveAuthorizationCode = (code, client, user, callback) => {
  const fields = {
    auth_code: code.authorizationCode,
    scope: [code.scope],
    expires_at: code.expiresAt,
    redirect_uri: code.redirectUri,
    client,
    user
  };

  OAuthAuthCodeModel.update({ authCode: code.authorizationCode }, fields, { upsert: true }, err => {
    if (err) {
      console.error(err);
    }

    callback(err);
  });
};

module.exports.revokeAuthorizationCode = code => {
  OAuthAuthCodeModel.remove({ authCode: code.authorizationCode }).then(authorizationCode => !!authorizationCode);
};
