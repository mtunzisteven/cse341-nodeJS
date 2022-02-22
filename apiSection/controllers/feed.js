exports.getPosts = (req, res, next) => {

    // This response(res.json()) returns a json format response to the request
    // This response(res.status(200).json()) includes status code to assist request understand outcome since they must decide what view to dispay
    res.status(200).json({
        post: [{title:" First Post", content:" This is the first post!"}]
    })
};


exports.postPost = (req, res, next) => {

    const title = req.body.title;
    const content = req.body.content;

    // This response(res.json()) returns a json format response to the request
    // This response(res.status(201).json()) includes status code to assist request understand outcome since they must decide what view to dispay
    // this post would be stored in the db
    res.status(201).json({
        message:'Post created subbessfully!',
        post: [{id: new Date().toISOString(), title:title, content:content}]
    })
};