const http = require('http');
const express = require('express');
const routes = require('./routes');

// create express application and store it in app const
const app = express();

// function((req, res, next)=>{...}) inside "use" will be executed for every incoming request:
// next arg required for the next middleware to be executed.
app.use((req, res, next)=>{

});

// app passed in server in order for it to handle incoming requests.
// requests will be funneled into middleware by express app. (req, res, next) => {...} 
const server = http.createServer(app);

// use server by listening for incoming requests
// it takes args host and port
server.listen(3000);