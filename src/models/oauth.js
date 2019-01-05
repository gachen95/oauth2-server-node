const AccessToken = require('./oauth_accesstoken');
const RefreshToken = require('./oauth_refreshtoken');
const User = require('./oauth_user');
const Client = require('./oauth_client');
const AuthorizationCode = require('./oauth_authcode');

// node-oauth2-server API

// ///////////////////////////////////////////////////////////////////////////
// 1. Methods used by all grant types
// ///////////////////////////////////////////////////////////////////////////
module.exports.getClient = Client.getClient;
module.exports.getAccessToken = AccessToken.getAccessToken;
module.exports.saveToken = AccessToken.saveAccessToken;

// ///////////////////////////////////////////////////////////////////////////
// 2. Methods used by refresh_token grant type only
// ///////////////////////////////////////////////////////////////////////////
module.exports.getRefreshToken = RefreshToken.getRefreshToken;
module.exports.revokeToken = AccessToken.revokeToken;

// ///////////////////////////////////////////////////////////////////////////
// 3. Methods used by password grant type only
// ///////////////////////////////////////////////////////////////////////////
module.exports.getUser = User.getUser;

// ///////////////////////////////////////////////////////////////////////////
// 4. Methods used by authorization code type only
// ///////////////////////////////////////////////////////////////////////////
module.exports.getAuthorizationCode = AuthorizationCode.getAuthorizationCode;
module.exports.revokeAuthorizationCode = AuthorizationCode.revokeAuthorizationCode;
module.exports.saveAuthorizationCode = AuthorizationCode.saveAuthorizationCode;
