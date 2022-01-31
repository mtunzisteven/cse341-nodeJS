const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imgUrl = req.body.imgUrl;
  const price = req.body.price;
  const description = req.body.description;
  product = new Product({
    title: title, 
    price: price, 
    description: description, 
    imgUrl: imgUrl, 
    userId: req.user // mongoose will pick out the id even though we added all user data
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
  const editMode = req.query.edit;
  if (!editMode) {
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
        product: product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedimgUrl = req.body.imgUrl;
  const updatedDesc = req.body.description;
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
    //------------------------------------*
    //          .populate()
    //
    // if we follow Product.find() with .populate('userId') we would get all fields of user under userId even though only user id was provided to id
    // passing a 2nd arg allows us to choose with user info to get: .populate('userId', 'name')
    //------------------------------------------------------------------------------------------------------------------------------------------|
    //------------------------------------*
    //          .select()
    //
    // if we follow Product.find() with .select('title price') we would get title and price form the db
    // we can even exclude some data from being retrieved using minus: .selecte('title price -_id') | _id always returned if not excluded

    Product.find() // mongoose function returns products from db
    .then(products => {
        console.log(products);
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
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
