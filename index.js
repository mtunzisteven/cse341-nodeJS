const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/errors');

const app = express();

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

// mongoose will give us the connection. No need for mongoConnect
mongoose
  .connect('mongodb+srv://mtunzi:MongoDBJune2022.@firstcluster21.ik5m1.mongodb.net/shop?retryWrites=true&w=majority') //connected to shop db in firstcluster21 of db user mtunzi with specified password "MongoDBJune2021."
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
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  })