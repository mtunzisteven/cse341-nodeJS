const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const feedRoutes = require('./routes/feed');

// using bodyParser with json() extracts incoming body data from req
app.use(bodyParser.json());

// set header to allow cross origin: set to all request
app.use((req, res, next)=>{

    res.setHeader('Access-Control-Allow-Origin', '*'); // allow origin from any server
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'); // set methods 

    // Authorization: allows extra authorization data
    // content typ allows ui to add or change content type
    // in this case, we would set it as follows on client/UI: 'Content-Type': 'application/json'
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 

    next();

})

app.use('/feed', feedRoutes);

app.listen(8080);