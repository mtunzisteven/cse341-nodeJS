const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user'); // get the model and in there, the user schema

exports.signup = (req, res, next) => {

    const errors = validationResult(req); // fetch all errors caught by express-validator in router

    if(!errors.isEmpty()){ // errors is not empty

        const error = new Error("Validation Failed!");

        error.statusCode = 422;

        throw error;
    }


    const email = req.body.email;
    const name = req.body.name;
    const status = req.body.status;
    const password = req.body.password;

    bcrypt.hash(password, 12)
        .then(hashedPassword=>{

            const user = new User({
                email:email, 
                password:hashedPassword,
                name:name
            })
        
            return user.save();
        })
        .then(result=>{
            res.status(201).json({
                    message:'User Created successfully!', 
                    userId:result._id
                })
        })
        .catch(err=>{
            if(!err.statusCode){ // give error a status code if it is not found 

                err.statusCode = 500;
    
            } // cannot throw error inside a promise, therefore we send it to next middleware
    
            next(err); // go to next middleware with err as an argument passed to it.
        })
};

exports.login = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;

    User.findOne({email: email})
        .then(user=> {

            if(!user){ // give error a status code if it is not found 

                const error = new Error('User with this email was not found')

                error.statusCode = 401;

                throw error;

            } // cannot throw error inside a promise, therefore we send catch block

            loadedUser = user;
            return bcrypt.compare(password, user.password); // check password is correct
        })
        .then(passwordCorrect=>{

            if(!passwordCorrect){// give error a status code if it is not correct 

                const error = new Error('Password and email combination not correct, Please try again');

                error.statusCode = 500;

                throw error;
            } // cannot throw error inside a promise, therefore we send catch block

            const token = jwt.sign(
                {
                    email: loadedUser.email,
                    userId: loadedUser._id.toString() 
                }, 
                'somedevelopercreatedsecretusedtosignthetoken', 
                {expiresIn:'1h'}
            );

            // This response(res.json()) returns a json format response to the request
            // This response(res.status(201).json()) includes status code to assist request understand outcome since they must decide what view to dispay
            res.status(200).json({
                token:token,
                userId: loadedUser._id.toString()
            });
        })
        .catch(err =>{

            if(!err.statusCode){ // give error a status code if it is not found 

                err.statusCode = 500;

            } // cannot throw error inside a promise, therefore we send it to next middleware

            next(err); // go to next middleware with err as an argument passed to it.
        });

};

exports.getUserStatus = (req, res, next) => {

    User.findById(req.userId)
        .then(user =>{


            if(!user){

                const error = new Error('User not found');
                error.statusCode = 404;

                throw error;

            }

            // This response(res.json()) returns a json format response to the request
            // This response(res.status(201).json()) includes status code to assist request understand outcome since they must decide what view to dispay
            res.status(200).json({
                status:user.status
            });
        })
        .catch(err =>{

            if(!err.statusCode){ // give error a status code if it is not found 

                err.statusCode = 500;

            } // cannot throw error inside a promise, therefore we send it to next middleware

            next(err); // go to next middleware with err as an argument passed to it.
        });
};

exports.updateUserStatus= (req, res, next) => {

    const newStatus = req.body.status;

    User.findById(req.userId)
        .then(user =>{


            if(!user){

                const error = new Error('User not found');
                error.statusCode = 404;

                throw error;

            }

            user.status = newStatus;

            user.save();

            // This response(res.json()) returns a json format response to the request
            // This response(res.status(201).json()) includes status code to assist request understand outcome since they must decide what view to dispay
            res.status(200).json({ message:'Status update successful!' });
        })
        .catch(err =>{

            if(!err.statusCode){ // give error a status code if it is not found 

                err.statusCode = 500;

            } // cannot throw error inside a promise, therefore we send it to next middleware

            next(err); // go to next middleware with err as an argument passed to it.
        });
};