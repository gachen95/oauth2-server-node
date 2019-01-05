/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');

// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;

const OAuthClientSchema = new Schema({
  client_id: String, // client_id
  client_secret: String,
  grants: [String],
  redirect_uris: [String]
});

// https://stackoverflow.com/questions/16663072/typeerror-on-static-method-of-mongoose-model
// need to set the static method before you create your model
// Models are, to use the Mongoose terminology, "compiled" from schemas.
// Once you created a model, any changes to the schema aren't propagated to the model that's derived from it.
// module.exports.getClient = (clientId, clientSecret, callback) => {

// Do not declare statics using ES6 arrow functions (=>). Arrow functions explicitly prevent binding this,
// so the above examples will not work because of the value of this.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#No_binding_of_this
OAuthClientSchema.static('getClient', function getClient(clientId, clientSecret, callback) {
  const params = { client_id: clientId };
  if (clientSecret != null) {
    params.client_secret = clientSecret;
  }

  OAuthClientModel.findOne(params, callback);
});

mongoose.model('client', OAuthClientSchema);
const OAuthClientModel = mongoose.model('client');

module.exports = OAuthClientModel;
