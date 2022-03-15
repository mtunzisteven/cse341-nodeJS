const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); //db connection
const multer = require('multer'); // file upload download package for non-Windows computers
const { v4: uuidv4 } = require('uuid'); // file upload download package for Windows computers

require('dotenv').config(); // import config values

const app = express();

// file upload/download middleware for macBooks
const fileStorage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'images');
  },
  filename: function(req, file, cb) {
      cb(null, uuidv4()) // create unique alphanumeric file name
  }
});

// check if file upload is an image type
const fileFilter = (req, res, cb) =>{
  if(file.mimetype == jpg || file.mimetype == png || file.mimetype == jpeg ){

    cb(null, true);

  }else{

    cb(null, false);

  }
};

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

// MongoDB URL
const MONGODB_URL = process.env.MONGODB_URL; 

// using bodyParser with json() extracts incoming body data from req
app.use(bodyParser.json());

// using multer 
app.use(multer({
  storage: fileStorage,
  file: fileFilter,
  })
  .single('image')
);

// serve images statically
app.use('/images', express.static(path.join(__dirname, 'images')));

// more elegant way to handle all errors
app.use((error, req, res, next)=>{

  console.log(error); // log the error for me

  const status = error.statusCode || 500;
  const message = error.message;

  res.status(status).json({message:message}); // returnn the error to the user

});

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
app.use('/auth', authRoutes);

// mongoose will give us the connection. No need for mongoConnect
mongoose
  .connect(
    MONGODB_URL
    ) //connected to shop db in firstcluster21 of db user mtunzi with specified password.
  .then(result => {
    // start server at localhost:3000
    app.listen(8080);
  })
  .catch(err => { 
    console.log(err); 
  })
