// https://github.com/expressjs/api-error-handler

/**
**********************************************************************

 API
.use(errorHandler([options]))
Currently no options.

Errors
**********************************************************************
4xx errors are exposed to the client. Properties exposed are:

message
type
name
code
status

5xx errors are not exposed to the client.
Instead, they are given a generic message as well as the type.
**********************************************************************

$ node --print "http.STATUS_CODES"
or
$ node
> http.STATUS_CODES
{ '100': 'Continue',
  '101': 'Switching Protocols',
  '102': 'Processing',
  '200': 'OK',
  '201': 'Created',
  '202': 'Accepted',
  '203': 'Non-Authoritative Information',
  '204': 'No Content',
  '205': 'Reset Content',
  '206': 'Partial Content',
  '207': 'Multi-Status',
  '300': 'Multiple Choices',
  '301': 'Moved Permanently',
  '302': 'Moved Temporarily',
  '303': 'See Other',
  '304': 'Not Modified',
  '305': 'Use Proxy',
  '307': 'Temporary Redirect',
  '400': 'Bad Request',
  '401': 'Unauthorized',
  '402': 'Payment Required',
  '403': 'Forbidden',
  '404': 'Not Found',
  '405': 'Method Not Allowed',
  '406': 'Not Acceptable',
  '407': 'Proxy Authentication Required',
  '408': 'Request Time-out',
  '409': 'Conflict',
  '410': 'Gone',
  '411': 'Length Required',
  '412': 'Precondition Failed',
  '413': 'Request Entity Too Large',
  '414': 'Request-URI Too Large',
  '415': 'Unsupported Media Type',
  '416': 'Requested Range Not Satisfiable',
  '417': 'Expectation Failed',
  '418': 'I\'m a teapot',
  '422': 'Unprocessable Entity',
  '423': 'Locked',
  '424': 'Failed Dependency',
  '425': 'Unordered Collection',
  '426': 'Upgrade Required',
  '428': 'Precondition Required',
  '429': 'Too Many Requests',
  '431': 'Request Header Fields Too Large',
  '500': 'Internal Server Error',
  '501': 'Not Implemented',
  '502': 'Bad Gateway',
  '503': 'Service Unavailable',
  '504': 'Gateway Time-out',
  '505': 'HTTP Version Not Supported',
  '506': 'Variant Also Negotiates',
  '507': 'Insufficient Storage',
  '509': 'Bandwidth Limit Exceeded',
  '510': 'Not Extended',
  '511': 'Network Authentication Required' }
 */

const statuses = require('statuses');

const production = process.env.NODE_ENV === 'production';

module.exports.apiErrorHandler = (err, req, res, next) => {
  let status = err.status || err.statusCode || 500;
  if (status < 400) status = 500;
  res.statusCode = status;

  const body = {
    status
  };

  // show the stacktrace when not in production
  // TODO: make this an option
  if (!production) body.stack = err.stack;

  // internal server errors
  if (status >= 500) {
    console.error(err.stack);
    body.message = statuses[status];
    res.json(body);
    return;
  }

  // client errors
  body.message = err.message;

  if (err.code) body.code = err.code;
  if (err.name) body.name = err.name;
  if (err.type) body.type = err.type;

  res.json(body);
};

module.exports.logErrors = (err, req, res, next) => {
  console.error(err.stack);
  next(err);
};
