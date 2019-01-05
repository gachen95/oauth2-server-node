/* eslint-disable prefer-destructuring */
const express = require('express');
const logger = require('morgan');
// const multer = require('multer');  // Node.js middleware for handling `multipart/form-data`.
// const favicon = require('serve-favicon');
const errorHandler = require('errorhandler');
const bodyParser = require('body-parser');
const Routes = require('./routes');
const Middleware = require('./middleware');

const app = express();

app.set('env', process.env.NODE_ENV || 'development');
app.set('port', process.env.PORT || 3000);

// development only
if (app.get('env') === 'development') {
  app.use(errorHandler());
}

// https://expressjs.com/en/guide/migrating-4.html
// app.use(favicon(path.join(__dirname, '/public/favicon.ico')));
app.use(bodyParser.json());
// set the bodyParser to parse the urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));

app.use('/oauth', Routes.oauth2);

// error handler
// development only
if (app.get('env') === 'development') {
  app.use(Middleware.logErrors);
}
app.use(Middleware.apiErrorHandler);

console.log(`Running enviroment ${app.get('env')}\n`);

const server = app.listen(app.get('port'), () => {
  console.log(`Oauth2 express server listening on port ${server.address().port}`);
});
