const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgrindTransport = require('nodemailer-sendgrid-transport');
require('dotenv').config(); // import config values

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgrindTransport({
    auth: {
        api_key: process.env.KEY
    }
}));

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: req.flash('loginError') // send flash message for signup error to ../views/auth/login.ejs page for display in div
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
    .then(user => {
        
        if(!user){
            req.flash('loginError', 'Invalid email or password.');  // create flash message for login error
            return res.redirect('/login');
        }

        bcrypt
        .compare(password, user.password) // compare entered password with mongodb user password using bcrypt
        .then(passwordsMatch => {

            if(passwordsMatch){

                req.session.isLoggedIn = true; // stores isLoggedIn session variable in mongo db
                req.session.user = user; // stores user session variable in mongo db
                return req.session.save(err => { // save() required to ensure the session is saved before the redirect is carried out.
                    
                    if(err){
                        req.flash('loginError', 'Internal error, please try again.');  // create flash message for login error
                        console.log(err);
                    }
                    res.redirect('/'); // go to home page if passwords matched

                });
            }
            req.flash('loginError', 'Invalid email or password.');  // create flash message for login error
            res.redirect('/login'); // go to signin page if passwords don't match
        });

    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    // clear session from mongodb
    req.session.destroy(err =>{
                    
        if(err){
            console.log(err);
        }
        res.redirect('/');
    });
};


exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: req.flash('signupError'), // send flash message for signup error to ../views/auth/signup.ejs page for display in div
      isAuthenticated: false
    });
  };


  exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if(password !== confirmPassword){
        req.flash('signupError', 'Passwords do not match.'); // create flash message for signup error
        return res.redirect('/signup'); // got to sign up page if passwords don't match
    }

    User.findOne({email: email}) // find a user document with email on the right, defined above.
    .then(userDoc => {
        if(userDoc){
            req.flash('signupError', 'Email already exists.'); // create flash message for signup error
            return res.redirect('/signup'); // get out of function and redirect to sign up page if user email exists
        }
        return bcrypt
        .hash(password, 12) // return promise with hashed passwrd in order to add another then block where we'll create user
        .then(hashedPassword => {

            // if no matching email was found, you can create the new user
            const user = new User({ 
                email: email,
                password: hashedPassword, // password to supply to user is hashed
                cart: { items:[]}
            });
            return user.save(); // save user to mongodb
        })
        .then(result =>{
            console.log(email);
            res.redirect('/login');
            return transporter.sendMail({
                to: email,
                from: 'mav19004@byui.edu',
                subject: 'Signup Successful!',
                html: '<h1>You Have Successfully Signed Up!'
            })
            .catch(err => {
                console.log(err)
          })
        })
    })

    .catch(err => {
          console.log(err)
    })
};