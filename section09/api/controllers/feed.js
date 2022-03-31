const { validationResult } = require('express-validator');
const Post = require('../models/post'); // get the model and in there, the post schema
const User = require('../models/user'); // get the model and in there, the post schema
const fs = require('fs');
const path = require('path');


exports.getPosts = (req, res, next) => {

    let currentPage = req.query.page || 1; // current page or initial page
    const perPage = 2;
    let totalItems;

    Post.find({creator:req.userId}) // get posts by the specific user, not ones created by another user(for total posts count)
        .countDocuments() // get the total number of posts in the db(posts docuements)
        .then(count=>{

            totalItems =count;

            return Post.find({creator:req.userId}) // for display
                .skip((currentPage - 1) * perPage)
                .limit(perPage) // per page set
        })
        .then(posts=>{

            // end the sherade if there is no posts found
            if(!posts){
                return;
            }

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

exports.getPost = async (req, res, next) => {

    const postId = req.params.postId;

    try{

        const post = await Post.findById(postId);

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

    }catch(err){

        if(!err.statusCode){ // give error a status code if it is not found 

            err.statusCode = 500;

        } // cannot throw error inside a promise, therefore we send it to next middleware

        next(err); // go to next middleware with err as an argument passed to it.
    };

};

exports.createPost = (req, res, next) => {

    const errors = validationResult(req); // fetch all errors caught by express-validator in router

    if(!errors.isEmpty()){ // errors is not empty

        const error = new Error("Validation Failed: Entered data is incorrect!");

        error.statusCode = 422;

        throw error;
    }

    // if the image file is not found as uploaded in the app.js file
    if(!req.file){
        const error = new Error('Could not find image file!');

        error.statusCode = 422;

        throw error; // will send us to catch block
    }

    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.path.replace("\\" ,"/");
    let creator;
    const post = new Post({
        title:title, 
        content:content,
        imageUrl:imageUrl,
        creator: req.userId // req.userId defined at authentication of user
    })

    post.save() // store post in db
        .then(result=> {
            return User.findById(req.userId); // get back the user logged using authentication defined userId

        })
        .then(user =>{
            creator = user; // save the user object in a variable so it can be passed through further then statements

            user.posts.push(post); // add the post to the user in the db
            return user.save(); // save the user with the new post added
        })
        .then(result => {

            // This response(res.json()) returns a json format response to the request
            // this post would be stored in the db
            res.status(201).json({
                message:'Post created subbessfully!',
                post: post,
                creator: {_id: creator._id, name: creator.name }
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

        // Check if post was found
        if(!post){
            const error = new Error('Could not find post!');

            error.statusCode = 404;

            throw error; // will send us to catch block
        }

        // check if the user trying to update the post is the logged in user
        if(post.creator.toString() !== req.userId){
            const error = new Error('Cannot edit post created by another user');

            error.statusCode = 403;

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

        
        // check if the user trying to update the post is the logged in user
        if(post.creator.toString() !== req.userId){
            const error = new Error('Cannot delete post created by another user');

            error.statusCode = 403;

            throw error; // will send us to catch block
        }

        // checked logged in user
        clearImage(post.imageUrl);

        // delete post
        return Post.findByIdAndRemove(postId);
    })
    .then(result => {
        return User.findById(req.userId); // find the specific user from db
    })
    .then(user =>{

        user.posts.pull(postId); // remove the post with the matching id
        return user.save();
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


// function for deleting an image in the server
const clearImage = filePath =>{

    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err=> console.log(err)); // deletes file in provided file path(images)
};