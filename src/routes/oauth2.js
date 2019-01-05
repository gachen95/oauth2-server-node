/* eslint-disable prefer-destructuring */
const app = require('express');
const OAuth2Server = require('oauth2-server');
const OAuth2ServerModel = require('../models');

const router = app.Router();

const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

app.oauth = new OAuth2Server({
  model: OAuth2ServerModel.OAuth,
  grants: ['password', 'authorization_code', 'refresh_token', 'client_credentials'],
  accessTokenLifetime: 60 * 60,
  allowBearerTokensInQueryString: true
});

function obtainToken(req, res, next) {
  const request = new Request(req);
  const response = new Response(res);

  console.log('Called obtainToken() ....... !!!');

  return app.oauth
    .token(request, response)
    .then(token => {
      res.json(token);
    })
    .catch(err => {
      // res.status(err.code || 500).json(err);
      next(err);
    });
}

function verifyToken(req, res, next) {
  const request = new Request(req);
  const response = new Response(res);

  return (
    app.oauth
      .authenticate(request, response)
      // eslint-disable-next-line no-unused-vars
      .then(token => {
        if (!token) res.json({ active: false });
        else
          res.json({
            active: true,
            scope: token.scope,
            client_id: token.client,
            username: token.user,
            exp: token.accessTokenExpiresAt
          });
      })
      .catch(err => {
        // res.status(err.code || 500).json(err);
        next(err);
      })
  );
}

// app.all('/oauth/token', obtainToken);
router.post('/token', obtainToken);
router.all('/verify', verifyToken);

// app.get('/oauth/authorize', (req, res) => {
// render an authorization form
// });

// app.post('/oauth/authorize', app.oauth.authorize());

function authenticateRequest(req, res, next) {
  const request = new Request(req);
  const response = new Response(res);

  return (
    app.oauth
      .authenticate(request, response)
      // eslint-disable-next-line no-unused-vars
      .then(token => {
        next();
      })
      .catch(err => {
        res.status(err.code || 500).json(err);
      })
  );
}

router.get('/', authenticateRequest, (req, res) => {
  res.send('Congratulations, you are in a secret area!');
});

module.exports = router;
