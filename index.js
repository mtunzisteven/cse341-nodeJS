const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')  // import Heroku options manager 
require('dotenv').config(); // import config values

const errorController = require('./controllers/errors');

const app = express();

const MONGODB_URL = process.env.MONGODB_URL || process.env.MONGODB_URI; // connection url for the db

const PORT = process.env.PORT || 3000; // listening prot for the server

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin'); 
const shopRoutes = require('./routes/shop');
const User = require('./models/user');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('616b9dbf15b4a69e7d148a59')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

const corsOptions = {
    origin: "https://rocky-tor-41343.herokuapp.com",
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false, 
    family: 4
};

// mongoose will give us the connection. No need for mongoConnect
mongoose
  .connect(
    MONGODB_URL, options
  )
  .then(result => {

    User.findOne() // MOngoose fn finds user in users db
    .then(user => {

      // only create a user if there's none found
      if(!user){
        // call user at start of server
        const user = new User({
          name: 'Mtunzi',
          email: 'st.vuma@gmail.com',
          cart: {
            items: []
          }
        });

        // save user in db using mongoose save() fn
        user.save();
    
      }
    })

    // start server at localhost:3000
    app.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  })