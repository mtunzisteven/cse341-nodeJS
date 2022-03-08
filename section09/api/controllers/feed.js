const { validationResult } = require('express-validator');
const Post = require('../models/post'); // get the model and in there, the post schema

exports.getPosts = (req, res, next) => {

    // This response(res.json()) returns a json format response to the request
    // This response(res.status(200).json()) includes status code to assist request understand outcome since they must decide what view to dispay
    res.status(200).json({
        posts: [{
                _id: "1",
                title:" First Post",
                content:" This is the first post!", 
                imageURL: "images/me.jpg",
                creator: {
                    name: "Mtunzi"
                },
                createdAt: new Date()
            }]
    })
};


exports.postPost = (req, res, next) => {

    const errors = validationResult(req); // fetch all errors caught by express-validator in router

    if(!errors.isEmpty()){ // errors is not empty

        return res.status(422).
                    json({
                        message:"Validation Failed: Entered data is incorrect!",
                        errors: errors.array()
                    });
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

        })
        .catch(err =>{

            console.log(err);
            // This response(res.json()) returns a json format response to the request
            // This response(res.status(201).json()) includes status code to assist request understand outcome since they must decide what view to dispay
            // this post would be stored in the db
            res.status(201).json({
                message:'Post created subbessfully!',
                post: result
            })

        });
};