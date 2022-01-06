const http = require('http');
const routes = require('./routes')

// we must store server in as var so we can use it later.
// we selected the listener which is in routes file
// execution will be handled by routes handler in routes 
const server = http.createServer(routes.handler);

// use server by listening for incoming requests
// it takes args host and port
server.listen(3000);