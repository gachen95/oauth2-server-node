/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
const Mongoose = require('mongoose');

// eslint-disable-next-line prefer-destructuring
const Schema = Mongoose.Schema;
// eslint-disable-next-line prefer-destructuring
const ObjectId = Schema.Types.ObjectId;

const OAuthRefreshTokenSchema = new Schema({
  refresh_token: {
    type: String,
    // required: true,
    unique: true
  },
  expires_at: Date,
  client: { type: ObjectId, ref: 'client' },
  user: { type: ObjectId, ref: 'user' }
});

OAuthRefreshTokenSchema.static('getRefreshToken', (refreshToken, cb) => {
  OAuthRefreshTokenModel.findOne({ refresh_token: refreshToken })
    .populate('client', 'client_id')
    .populate('user', 'username email')
    .exec((err, token) => {
      cb(err, token);
    });
});

Mongoose.model('refresh_token', OAuthRefreshTokenSchema);
const OAuthRefreshTokenModel = Mongoose.model('refresh_token');

module.exports = OAuthRefreshTokenModel;
