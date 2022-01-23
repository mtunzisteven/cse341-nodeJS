// The logic of the app admin views and data connection
// we save data, fetch it and specify ejs files to render
const Cart = require('../models/cart');
const Products = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', { // the ejs file to render
      pageTitle: 'Add Product', // the title of the ejs file to render
      path: '/admin/add-product', // the path entered on url
      editing: false
    });
};

exports.postProduct =(req, res, next) => {
    const title = req.body.title;
    const imgUrl = req.body.imgUrl; 
    const price = req.body.price;
    const description = req.body.description;
    const product = new Products(null, title, imgUrl, price, description); // we store the product object in a constant product 
    product.save();  // save that product in the storage created for products
    res.redirect('/products'); // redirect to products page
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode){ // if there are no editMode(false), just go to main page
    return res.redirect("/");
  }

  const productId = req.params.productId;
  Products.fetchById(productId, product => { // in fetchAll, products passed as empty variable(cb). It eventually is loaded with array of products
    
    if(!product){ // if there are no products, just go to main page
      return res.redirect("/");
    }
    // if products are found in storage proceed
    res.render('admin/edit-product', { // the ejs file to render
      pageTitle: 'Edit Product', // the title of the ejs file to render
      path: '/admin/edit-product', // the path entered on url
      editing: editMode, // tell ejs that it is edit mode
      product: product // transfer product to ejs
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prouctId = req.body.productId;
  const updateTitle = req.body.title;
  const updatePrice = req.body.price;
  const updateImgUrl = req.body.imgUrl;
  const updateDescription = req.body.description;
  const product = new Products(prouctId, updateTitle, updateImgUrl, updatePrice, updateDescription); // we store the product object in a constant product 
  product.save();  // save that product in the storage created for products
  res.redirect('/admin/admin-products'); // redirect to products page
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  const productPrice = req.body.price;
  Cart.deleteCartProductById(productId, productPrice);
  Products.deleteProductById(productId);
  res.redirect('/admin/admin-products'); // redirect to products page
}

exports.getAdminProducts = (req, res, next) => {
  Products.fetchAll(products => { // in fetchAll, products passed as empty variable(cb). It eventually is loaded with array of products
    res.render('admin/admin-products', { // open admin products page
    prods: products, // put products array into prods
    pageTitle: 'Products',  // the title of the ejs file to render
    path: '/admin/admin-products', // the path entered on url
  });
});
};
