const crypto = require('crypto'); // import built-in Node JS secure random value generator
const bcrypt = require('bcryptjs'); // csrf token generating package imported
const {validationResult} = require('express-validator'); // import validationResult method of express validator sub package that stores all errors stored at 'check(property).isProperty'
const nodemailer = require('nodemailer');
const sendgrindTransport = require('nodemailer-sendgrid-transport');
require('dotenv').config(); // import config values

const serverError = require('../util/serverError'); // server error helper

const User = require('../models/user');

// url for reset password
const APP_URL = process.env.PASSWORD_RESET_URL || 'http://localhost:3000';

const transporter = nodemailer.createTransport(sendgrindTransport({
    auth: {
        api_key: process.env.KEY
    }
}));

exports.getLogin = (req, res, next) => {
    let errorMessage = req.flash('loginMsg');
    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: errorMessage, // send flash message for error to ../views/auth/login.ejs page for display in div
        loginData: {
            email: '',
            password: '',
        }
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let errors = validationResult(req); // get all erros stored by check in this request

    // when errors are found, we'll redirect to login page and send error message from express validator
    if(!errors.isEmpty()){

        req.session.isLoggedIn = false; // negate any false positive by password compair if password is wrong characters.
        return res.status(422)
        .render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg, // send message for signup error to ../views/auth/signup.ejs page for display in div
            loginData: {
                email: email,
                password: password,
            }        
        });
    }

    return req.session.save(err => { // save() required to ensure the session data is saved to db before the redirect is carried out.
        
        if(err){
            req.flash('loginMsg', 'Internal error, please try again.');  // create flash message for login error
            next(err);
        }
        res.redirect('/'); // go to home page if passwords matched
    })
};

exports.postLogout = (req, res, next) => {
    // clear session from mongodb
    req.session.destroy(err =>{
                    
        if(err){
            next(err);
        }
        res.redirect('/');
    });
};


exports.getSignup = (req, res, next) => {

    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: null, // send flash message for signup error to ../views/auth/signup.ejs page for display in div
      isAuthenticated: false,
      signupData: {
        email: '',
        password: '',
        confirmPassword: ''
    },
    signupErrors: []
    });
  };

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let errors = validationResult(req); // get all erros stored by check in this request

    if(!errors.isEmpty()){
        return res.status(422)
        .render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg, // send message for signup error to ../views/auth/signup.ejs page for display in div
            signupData: {
                email: email,
                password: password,
                confirmPassword: req.body.confirmPassword
            },
            signupErrors: errors.array()
        });
    }

    bcrypt
    .hash(password, 12) // return promise with hashed passwrd in order to add another then block where we'll create user
    .then(hashedPassword => {

            // if no matching email was found, you can create the new user
            const user = new User({ 
                email: email,
                password: hashedPassword, // password to supply to user is hashed
                userLevel: 'customer',
                cart: { items:[]}
            });
            return user.save(); // save user to mongodb
        })
        .then(result =>{
            res.redirect('/login');
            return transporter.sendMail({
                to: email,
                from: 'mav19004@byui.edu',
                subject: 'Signup Successful!',
                html: '<h1>You Have Successfully Signed Up!'
            })
            .catch(err => {
                next(err)
          })
        })
};
  
exports.getReset = (req, res, next) => {
    let errorMessage = req.flash('resetError');
    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }
    res.render('auth/reset', {
      path: '/Reset',
      pageTitle: 'Reset Password',
      errorMessage: errorMessage, // send flash message for signup error to ../views/auth/signup.ejs page for display in div
      isAuthenticated: false
    });
};

exports.postReset = (req, res, next) => {
    const email = req.body.email;
    crypto.randomBytes(32, (err, buffer) =>{

        // if there's an error generating 32 bytes random bytes value with crypto.Random
        if(err){
            next(err);
            return res.redirect('/reset');
        }

        // no error returning 32 crypto.RandomBytes values
        const token = buffer.toString('hex'); // buffer returns hex values. toString arg allows it to work with hex to ASCII chars
        User.findOne({email: email})
            .then(user => {
                
                // if email doesn't exist, load error mssage and redirect to reset page
                if(!user){ 
                    req.flash('resetError', 'No account with the supplied email was found');
                    return res.redirect('/reset');
                }

                // if we make it this far, the eamail exsts in the db
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000; // date now expressed in millisecons | 3, 600, 000 milliseconds equals 1 hour
                return user.save();
            })
            .then(result => {

                req.flash('loginMsg', 'A reset message has been sent out to your email. The reset link will expire in 1 hour.');  // create flash message for login error
                res.redirect('/login');

                // log email message to test reset ability
                console.log(`Hello. You requested a password reset. Please click on this: ${APP_URL}/reset/${token}`);


                // Create email  
                return transporter.sendMail({
                    to: email,
                    from: 'mav19004@byui.edu',
                    subject: 'Password Reset!',
                    html: `<p>Hello. You requested a password reset. Please click on this <a href=${APP_URL}/reset/${token}'>link</a> to reset your password.</p>`
                })
            })
            .catch(err => serverError(err, res));
    });
};

exports.getNewPassword = (req, res, next) => {
    let errorMessage = req.flash('newPasswordError');
    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }
    const token = req.params.token; // will be received in routes path as /reset/:token
    User.findOne({ resetToken: token, resetTokenExpiration: {$gt: Date.now( )}}) // $gt means greater than: mongoose
    .then(user => {
        res.render('auth/new-password', {
            path: '/new-password',
            pageTitle: 'New Password',
            errorMessage: errorMessage, // send flash message for reset error to ../views/auth/reset.ejs page for display in div
            isAuthenticated: false,
            userId: user._id.toString(),
            passwordToken: token // passing this for the hidden input that receives it
        });
    })
    .catch(err => serverError(err, res));

  };

exports.postNewPassword = (req, res, next) => {
    let errors = validationResult(req);
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    if (!errors.isEmpty()) {

        req.flash('newPasswordError', errors.array()[0].msg)

        return res.redirect(`/reset/${passwordToken}`);

    }

    User.findOne({ 
        resetToken: passwordToken, 
        resetTokenExpiration: {$gt: Date.now( )},
        _id: userId
    }) // $gt means greater than: mongoose
    .then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12);

    })
    .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;

        return resetUser.save();
    })
    .then(result => {
        res.redirect('/login');
    })
    .catch(err => serverError(err, res));

};