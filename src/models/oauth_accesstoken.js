/* eslint-disable no-underscore-dangle */
const Mongoose = require('mongoose');

const OAuthRefreshTokenModel = require('./oauth_refreshtoken');

// eslint-disable-next-line prefer-destructuring
const Schema = Mongoose.Schema;
// eslint-disable-next-line prefer-destructuring
const ObjectId = Schema.Types.ObjectId;

const OAuthAccessTokenSchema = new Schema({
  access_token: {
    type: String,
    required: true,
    unique: true
  },
  expires_at: Date,
  client: { type: ObjectId, ref: 'client' },
  user: { type: ObjectId, ref: 'user' }
});

Mongoose.model('access_token', OAuthAccessTokenSchema);

const OAuthAccessTokenModel = Mongoose.model('access_token');

module.exports.getAccessToken = (accessToken, cb) => {
  OAuthAccessTokenModel.findOne({ access_token: accessToken })
    .populate('client', 'client_id')
    .populate('user', 'username email')
    .exec((err, token) => {
      if (err) {
        cb(err);
      }

      if (!token) {
        cb(err, token);
      } else
        cb(err, {
          accessToken: token.access_token,
          accessTokenExpiresAt: token.expires_at,
          scope: token.scope,
          client: token.client.client_id, // with 'id' property
          user: token.user.username || token.user.email
        });
    });
};

module.exports.saveAccessToken = (token, client, user, callback) => {
  token.client = client._id;
  token.user = user._id;

  const accessParams = {
    access_token: token.accessToken,
    expires_at: token.accessTokenExpiresAt
  };

  const refreshParams = {
    refresh_token: token.refreshToken,
    expires_at: token.refreshTokenExpiresAt
  };

  // eslint-disable-next-line prettier/prettier
  OAuthAccessTokenModel.updateOne({ client: client._id, user: user._id }, accessParams, { upsert: true }, err => {
    if (err) {
      callback(err);
    }

    OAuthRefreshTokenModel.updateOne({ client: client._id, user: user._id }, refreshParams, { upsert: true }, error => {
      if (error) {
        callback(error);
      }

      token.client = {
        id: client.client_id
      };

      token.user = {
        id: user.username || user.email
      };

      callback(error, token);
    });
  });
};

module.exports.revokeToken = (token, cb) => {
  OAuthAccessTokenModel.remove({ access_token: token.accessToken }, (err, res) => {
    if (err) {
      cb(err);
    }

    cb(err, !!res);
  });
};
