/* eslint-disable no-use-before-define */
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;

const OAuthUserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    index: true,
    trim: true,
    lowercase: true // Always convert `email` to lowercase
  },
  username: {
    type: String,
    unique: true,
    required: true,
    index: true,
    trim: true,
    lowercase: true // Always convert `username` to lowercase
  },
  hashed_password: { type: String, required: true },
  password_reset_token: { type: String, unique: true },
  reset_token_expires: Date,
  name: {
    first: String,
    last: String
  },
  role: { type: String, default: 'user' },
  verified: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});

// Do not declare methods using ES6 arrow functions (=>). Arrow functions explicitly prevent binding this,
// so your method will not have access to the document and the above examples will not work.
OAuthUserSchema.virtual('fullName')
  // console.log(axl.fullName); // William Rose
  .get(function getFullname() {
    return `${this.name.first} ${this.name.last}`;
  })
  // axl.fullName = 'William Rose'; // Now `axl.name.first` is "William"
  .set(function setFullName(v) {
    this.name.first = v.substr(0, v.indexOf(' '));
    this.name.last = v.substr(v.indexOf(' ') + 1);
  });

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

OAuthUserSchema.static('register', (fields, cb) => {
  fields.hashed_password = hashPassword(fields.password);
  delete fields.password;

  const user = new OAuthUserModel(fields);
  user.save(cb);
});

OAuthUserSchema.static('getUser', (email, password, cb) => {
  OAuthUserModel.authenticate(email, password, (err, user) => {
    if (err || !user) return cb(err);

    return cb(null, user);
  });
});

OAuthUserSchema.static('authenticate', function auth(email, password, cb) {
  this.findOne({ email }, (err, user) => {
    if (err || !user) return cb(err);

    return cb(null, bcrypt.compareSync(password, user.hashed_password) ? user : null);
  });
});

mongoose.model('user', OAuthUserSchema);
const OAuthUserModel = mongoose.model('user');

module.exports = OAuthUserModel;
