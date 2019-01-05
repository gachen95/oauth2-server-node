const models = require('./src/models');

models.OAuthUser.create(
  {
    email: 'gachen95@example.com',
    username: 'gachen95',
    hashed_password: '$2a$10$aZB36UooZpL.fAgbQVN/j.pfZVVvkHxEnj7vfkVSqwBOBZbB/IAAK'
  },
  err => {
    if (err) console.log(err);

    // clientId:clientSecret base64 is
    // YXBwbGljYXRpb246c2VjcmV0
    models.OAuthClient.create(
      {
        client_id: 'application',
        client_secret: 'secret',
        grants: ['password', 'refresh_token'],
        redirect_uris: ['/oauth/redirect']
      },
      () => {
        process.exit();
      }
    );
  }
);
