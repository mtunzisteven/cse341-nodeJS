const express = require('express');
const { body } = require('express-validator');


const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

const User = require('../models/user');

const router = express.Router();

/**
* @swagger
*  components:
*      schemas:
*          User:
*              type: object
*              properties:
*                  email:
*                      type: string
*                  password:
*                      type: string
*                  name:
*                      type: string
*                  status:
*                      type: string
*                  posts:
*                      type: array
*/



/**
* @swagger
* /signup:
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
* /auth:
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