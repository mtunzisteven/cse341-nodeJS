const express = require('express');
const { body } = require('express-validator');


const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

const User = require('../models/user');

const router = express.Router();

// The definition of the User object, which we'll use to create, access, update, and delete the user.

/**
* @swagger
*  components:
*      schemas:
*          User:
*              type: object
*              required: 
*                  - email
*                  - password
*                  - name
*              properties:
*                  email:
*                      type: string
*                      description: The email that the user will use to log in
*                  password:
*                      type: string
*                      description: The secret password that the user will use to log in
*                  name:
*                      type: string
*                      description: The user's name which will appear when they are called in the app
*                  status:
*                      type: string
*                      description: The initial status of the user
*                  posts:
*                      type: object
*                      description: All the posts made by the user
*/


// The definition of the signup route.

/**
* @swagger
* /auth/signup:
*  put:
*      summary: creates a new user
*      description: New users can signup for an account in order to have quotes in the system
*      requestBody:
*          required: true
*          content:
*              application/json:
*                  schema:
*                      $ref: '#components/schemas/User'
*      responses:
*          200:
*              description: User Create Successfully
*
*/

//PUT /auth/signup/
router.put(
    '/signup/',    
    [ // validation middleware uses {check} above
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .custom((value, {req})=>{

                return User
                        .findOne({email:value})
                        .then(userDoc=>{
                            
                            if(userDoc){
                                return Promise.reject('E-mail already exists!');
                            }
                        });
            }),
        body('name')
            .trim()
            .not()          // is not
            .isEmpty(),     // empty
        body('password')
            .trim()
            .isLength({min:6}),
    ], 
    authController.signup
);

/**
* @swagger
* /auth/login:
*  post:
*      summary: User Login
*      description: Existent users can log in and acquire a Token for the API use
*      requestBody:
*          required: true
*          content:
*              application/json:
*                  schema:
*                      $ref: '#components/schemas/User'
*      responses:
*          200:
*              description: OK
*/

//POST /auth/login/
router.post('/login', authController.login); // not validated becausse checks are done in the controller

//GET /auth/status/
router.get('/status', isAuth, authController.getUserStatus); 

//get /auth/status/
router.patch(
    '/status', 
    isAuth, [
        body('status')
            .trim()
            .not()
            .isEmpty()
    ], 
    authController.updateUserStatus
); 

module.exports = router;