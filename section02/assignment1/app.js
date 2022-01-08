const express = require('express');

// create express application and store it in app const
const app = express();

// // no filter 
// app.use((req, res, next)=>{
//     console.log('1st Middleware');
//     next();
// });

// // no filter
// app.use((req, res, next)=>{
//     console.log('2nd Middleware');
// });

// filter for /users path
app.use('/users',(req, res, next)=>{
    console.log('In Users Middleware');
    res.send('<h1>Handling only /users</h1>')
});

// filter for / path
app.use('/',(req, res, next)=>{
    console.log('In Middleware');
    res.send('<h1>Handling only /</h1>')
});

// start server and listen for incoming requests
app.listen(3000);