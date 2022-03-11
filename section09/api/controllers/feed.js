const { validationResult } = require('express-validator');
const Post = require('../models/post'); // get the model and in there, the post schema

exports.getPosts = (req, res, next) => {

    Post.find()
        .then(posts=>{

            console.log(posts);

            res.status(200).json({
                message: 'Fetched posts successfully', 
                posts:posts
            });

        })
        .catch(err=>{

            if(!err.statusCode){ // give error a status code if it is not found 

                err.statusCode = 500;

            } // cannot throw error inside a promise, therefore we send it to next middleware

            next(err); // go to next middleware with err as an argument passed to it.
        })
};

exports.getPost = (req, res, next) => {

    const postId = req.params.postId;

    Post.findById(postId)
    .then(post =>{

        console.log(post);

        if(!post){
            const error = new Error('Could not find post!');

            error.statusCode = 404;

            throw error; // will send us to catch block
        }

        // This response(res.json()) returns a json format response to the request
        // This response(res.status(200).json()) includes status code to assist request understand outcome since they must decide what view to dispay
        res.status(200).json({
            post: post
        })
    })
    .catch(err =>{

        if(!err.statusCode){ // give error a status code if it is not found 

            err.statusCode = 500;

        } // cannot throw error inside a promise, therefore we send it to next middleware

        next(err); // go to next middleware with err as an argument passed to it.
    });

};

exports.postPost = (req, res, next) => {

    const errors = validationResult(req); // fetch all errors caught by express-validator in router

    if(!errors.isEmpty()){ // errors is not empty

        const error = new Error("Validation Failed: Entered data is incorrect!");

        error.statusCode = 422;

        throw error;
    }

    const title = req.body.title;
    const content = req.body.content;

    const post = new Post({
        title:title, 
        content:content,
        imageUrl:'images/me.jpg',
        creator: { name: "Mtunzi" }
    })

    post.save()
        .then(result=> {

            console.log(result);
            // This response(res.json()) returns a json format response to the request
            // This response(res.status(201).json()) includes status code to assist request understand outcome since they must decide what view to dispay
            // this post would be stored in the db
            res.status(201).json({
                message:'Post created subbessfully!',
                post: result
            })
        })
        .catch(err =>{

            if(!err.statusCode){ // give error a status code if it is not found 

                err.statusCode = 500;

            } // cannot throw error inside a promise, therefore we send it to next middleware

            next(err); // go to next middleware with err as an argument passed to it.
        });
};