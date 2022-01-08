const express = require('express');
// const routes = require('./routes');

// create express application and store it in app const
const app = express();

// any path that is different to root path ('/') must come bfore root path
// Other wise, use next in the top middleware if it doesnot use res middleware 
app.use('/products',(req, res, next)=>{
    console.log('In Products Middleware');
    res.send('<h1>Products Page!</h1>')
});

// function((req, res, next)=>{...}) inside "use" will be executed for every incoming request:
// next arg required for the next middleware to be executed. res.send(html) send response to brower. Next not required in that case
app.use('/',(req, res, next)=>{
    console.log('In Middleware');
    res.send('<h1>Hello from Express App!</h1>')
});

// app passed in server in order for it to handle incoming requests.
// requests will be funneled into middleware by express app. (req, res, next) => {...} 
// const server = http.createServer(app); This is taken care of by express app
// use server by listening for incoming requests
// it takes args host and port
app.listen(3000);