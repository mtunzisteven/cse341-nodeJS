const Product = require('../models/product');
const {validationResult} = require('express-validator'); // import validationResult method of express validator sub package that stores all errors stored at 'check(property).isProperty'

exports.getAddProduct = (req, res, next) => {

  let  errorMessage = null;

  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    errorMessage: errorMessage, // send flash message for error to ../views/auth/login.ejs page for display in div
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {

  
  // if the image file is not found as uploaded in the app.js file
  if(!req.file){

    const error = new Error('Could not find image file!');

    error.statusCode = 422;

    throw error; // will send us to catch block
  }

  // extract form data from request 
  const title = req.body.title;
  const image = req.file.path.replace("\\" ,"/");
  const price = req.body.price;
  const description = req.body.description;

  let errors = validationResult(req); // get all erros stored by check in this request

  // when errors are found, we'll redirect add products page and send error message from express validator
  if(!errors.isEmpty()){

    return res.status(422)
    .render('admin/edit-product', {
        path: '/admin/add-product',
        pageTitle: 'Add Product',
        errorMessage: errors.array()[0].msg, // send message for signup error to ../views/auth/signup.ejs page for display in div
        productData: {
          title: title, 
          price: price, 
          description: description, 
          image: image
        },
        editing: false
    });
  }

  product = new Product({
    title: title, 
    price: price, 
    description: description, 
    imgUrl: image, 
    userId: req.user, // mongoose will pick out the id even though we added all user data

  });
  
  product
  .save() // Mongooose fn to save product in db
  .then(result => {
    // console.log(result);
    console.log('Created Product');
    res.redirect('/admin/products');
  })
  .catch(err => {
    console.log(err);
  });
};

exports.getEditProduct = (req, res, next) => {

  let  errorMessage = null;

  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }else if(!res.locals.admin){
    return res.redirect('/');
  }

  const prodId = req.params.productId;
    Product.findById(prodId) // Mongoose fn returns product by id from db
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        errorMessage: errorMessage

      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {

  // if the image file is not found as uploaded in the app.js file
  if(!req.file){

    const error = new Error('Could not find image file!');

    error.statusCode = 422;

    throw error; // will send us to catch block
  }

  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedimage = req.file.path.replace("\\" ,"/");
  const updatedDesc = req.body.description;

  let errors = validationResult(req); // get all erros stored by check in this request

  // when errors are found, we'll redirect edit products page and send error message from express validator
  if(!errors.isEmpty()){

    return res.status(422)
    .render('admin/edit-product', {
        path: '/admin/edit-product',
        pageTitle: 'Edit Product',
        errorMessage: errors.array()[0].msg, // send message for signup error to ../views/auth/signup.ejs page for display in div
        productData: {
          title: title, 
          price: price, 
          description: description, 
          image: updatedimage
        },
        editing: true
    });
  }

  Product.findById(prodId) // Mongoose fn returns product by id from db
  .then(product =>{

    // update all product attributes for the specific product
    product.title = updatedTitle;
    product.imgUrl = updatedimgUrl;
    product.price = updatedPrice;
    product.description = updatedDesc;

    return product.save() // mongoose function that will update the fetched product in the db

  })
  .then(result => {
    // console.log(result);
    console.log('UPDATED PRODUCT!');
    res.redirect('/admin/products');
  })
  .catch(err => {
    console.log(err);
  });
};

exports.getProducts = (req, res, next) => {

  if(!res.locals.admin){
    return res.redirect('/');
  }

  //------------------------------------*
  //          .populate()
  //
  // if we follow Product.find() with .populate('userId') we would get all fields of user under userId even though only user id was provided to id
  // passing a 2nd arg allows us to choose which user info to get: .populate('userId', 'name')
  //------------------------------------------------------------------------------------------------------------------------------------------|
  //------------------------------------*
  //          .select()
  //
  // if we follow Product.find() with .select('title price') we would get title and price form the db
  // we can even exclude some data from being retrieved using minus: .selecte('title price -_id') | _id always returned if not excluded

  Product.find() // mongoose function returns products from db
  .then(products => {

    console.log(products[0].imgUrl);

      res.render('admin/products', {
          prods: products,
          pageTitle: 'Admin Products',
          path: '/admin/products',
          

      });
  })
  .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId) // Mongoose function for deleting product by id
    .then(result => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
