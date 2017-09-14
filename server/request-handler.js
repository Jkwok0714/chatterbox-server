/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var url = require('url');

var data = {};
data.results = [];

// var exports = module.exports = {};
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  var statusCode = 200;
  var headers = defaultCorsHeaders;
  
  var validEndpoints = ['/classes/messages', '/classes/room'];
  // if (validEndpoints.indexOf(url.parse(request.url).) === -1) {
  if (!request.url.includes(validEndpoints[0]) && !request.url.includes(validEndpoints[1])) {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(data));
  }

  // See the note below about CORS headers.

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'application/json';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  

  //GET, POST, PUT, DELETE, OPTIONS
  if (request.method === 'POST') {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    
    request.on('end', () => {
      body = JSON.parse(body);
      body.objectId = Date.now();
      body.createdAt = Date.now();
      data.results = data.results.concat(body);
    });
    statusCode = 201;
  } else if (request.method === 'GET') {
    //could have a filterBy property (filter by room, username)
    
    var query = url.parse(request.url, true).query;
    if (query.order) {
      var newData = {results: data.results.slice(0)};
      var key = query.order;
      if (query.order[0] === '-') {
        key = key.split('').slice(1).join('');
        newData.results.sort(function(a, b) {
          return a[key] - b[key];
        });
      } else {
        newData.results.sort(function(a, b) {
          return b[key] - a[key];
        });
      }
      
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(newData));
    }
  } else if (request.method === 'PUT') {
    // find the message by id
      // if it doesn't exist, create new object and append it to data.results
    // requires id parameter, property(either message or username)
    // modify whatever property
  } else if (request.method === 'DELETE') {
    // find the message by id
    // requires id parameter
    // splice it from data.results
  } else if (request.method === 'OPTIONS') {
    //add detailed parameters for all the method ypes
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(headers));
  }
  
  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


exports.requestHandler = requestHandler;
exports.defaultCorsHeaders = defaultCorsHeaders;
// exports.data = data;

