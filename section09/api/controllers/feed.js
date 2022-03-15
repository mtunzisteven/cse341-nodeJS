const { validationResult } = require('express-validator');
const Post = require('../models/post'); // get the model and in there, the post schema
const fs = require('fs');
const path = require('path');


exports.getPosts = (req, res, next) => {

    let currentPage = req.query.page || 1; // current page or initial page
    const perPage = 2;
    let totalItems;

    Post.find()
        .countDocuments() // get the total number of posts in the db(posts docuements)
        .then(count=>{

            totalItems =count;

            return Post.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage) // per page set
        })
        .then(posts=>{

            res.status(200).json({
                message: 'Fetched posts successfully', 
                posts:posts,
                totalItems: totalItems
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

exports.createPost = (req, res, next) => {

    const errors = validationResult(req); // fetch all errors caught by express-validator in router

    if(!errors.isEmpty()){ // errors is not empty

        const error = new Error("Validation Failed: Entered data is incorrect!");

        error.statusCode = 422;

        throw error;
    }

    
    if(!req.file){
        const error = new Error('Could not find image file!');

        error.statusCode = 422;

        throw error; // will send us to catch block
    }

    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.path.replace("\\" ,"/");

    const post = new Post({
        title:title, 
        content:content,
        imageUrl:imageUrl,
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
            });
        })
        .catch(err =>{

            if(!err.statusCode){ // give error a status code if it is not found 

                err.statusCode = 500;

            } // cannot throw error inside a promise, therefore we send it to next middleware

            next(err); // go to next middleware with err as an argument passed to it.
        });
};


exports.updatePost = (req, res, next) => {

    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image; // already set in server. In react it is saved as image

    const errors = validationResult(req); // fetch all errors caught by express-validator in router

    if(!errors.isEmpty()){ // errors is not empty

        const error = new Error("Validation Failed: Entered data is incorrect!");

        error.statusCode = 422;

        throw error;
    }
    
    if(req.file){ // When a new image update is made

        imageUrl = req.file.path.replace("\\" ,"/");
    }

    if(!imageUrl){ // if failed to load file on both above ways, throw an error

        const error = new Error('Could not find file!');

        error.statusCode = 422;

        throw error; // will send us to catch block
    }

    Post.findById(postId)
    .then(post =>{

        if(!post){
            const error = new Error('Could not find post!');

            error.statusCode = 404;

            throw error; // will send us to catch block
        }

        // When the image url saved in images is not equal to the posted(put) url, the image has been replaced.
        if(imageUrl !== post.imageUrl){

            console.log(post.imageUrl);

            clearImage(post.imageUrl); // delete the old file that has been replaced in the post being updated.

        }

        // update post details
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;

        return post.save(); // save to db

    })
    .then(result=>{
        res.status(200)
            .json({
                massage:"Post updated successfully", 
                post:result // this is the post
            });
    })
    .catch(err =>{

        if(!err.statusCode){ // give error a status code if it is not found 

            err.statusCode = 500;

        } // cannot throw error inside a promise, therefore we send it to next middleware

        next(err); // go to next middleware with err as an argument passed to it.
    });
};

exports.deletePost = (req, res, next) => {

    const postId = req.params.postId;

    Post.findById(postId)
    .then(post=>{

        if(!post){
            const error = new Error('Could not find post!');

            error.statusCode = 404;

            throw error; // will send us to catch block
        }

        // checked logged in user
        clearImage(post.imageUrl);

        // delete post
        return Post.findByIdAndRemove(postId);
    })
    .then(result=>{
        res.status(200).json({massage:"Post deleted successfully"});
    })
    .catch(err =>{

        if(!err.statusCode){ // give error a status code if it is not found 

            err.statusCode = 500;

        } // cannot throw error inside a promise, therefore we send it to next middleware

        next(err); // go to next middleware with err as an argument passed to it.
    });

}


const clearImage = filePath =>{

    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err=> console.log(err)); // deletes file in provided file path(images)
};