// error handling
// https://github.com/expressjs/api-error-handler
// https://github.com/jshttp/http-errors  -- Create HTTP errors for Express, Koa, Connect, etc. with ease.
// https://github.com/kbariotis/throw.js
// https://expressjs.com/en/guide/error-handling.html

// https://nemethgergely.com/error-handling-express-async-await/

const ErrorHandler = require('./error_handler');

module.exports.apiErrorHandler = ErrorHandler.apiErrorHandler;
module.exports.logErrors = ErrorHandler.logErrors;
