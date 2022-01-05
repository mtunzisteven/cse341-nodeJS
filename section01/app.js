const http = require('http');
const routes = require('./routes')

// request listener function I defined that must take 
// two args. One to accept and read the request data 
// and another to respond to that request.
//function reqListener(req, res){}

// create server function calls listener without braces
// options: 
//                  http.createServer(function(req, res){});  
//                  http.createServer((req, res) => {}); recommended by me
//                  http.createServer(reqListener);

// we must store server in as var so we can use it later.
// we selected the listener which is in routes file
// execution will handled by routes handler in routes 
const server = http.createServer(routes.handler);

// use server by listening for incoming requests
// it takes args host and port
server.listen(3000);