const fs = require('fs');
const path = require('path');
const pdfConstructor = require('pdfkit');
const serverError = require('../util/serverError'); // server error helper

const Product = require('../models/product');
const Order = require('../models/order');


exports.getProducts = (req, res, next) => {
  Product.find() // mongoose function
    .then(products => {

      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'

      });
    })
    .catch(err => serverError(err, res));

};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId) // Mongoose function finds in db by id
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'

      });
    })
    .catch(err => serverError(err, res));
  };

exports.getIndex = (req, res, next) => {
      Product.find() // mongoose function
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',

      });
    })
    .catch(err => serverError(err, res));

};

exports.getCart = (req, res, next) => {

  req.user
    .populate('cart.items.product')
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        
      });
    })
    .catch(err => serverError(err, res));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
  .then(product=>{
    return req.user.addToCart(product);
  })
  .then(result=>{
    res.redirect('/cart');
  })
  .catch(err => serverError(err, res));

};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
  .deleteCartItem(prodId)
  .then(result => {
    res.redirect('/cart');
  })
  .catch(err => serverError(err, res));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.product')
    .then(user => {
      const products = user.cart.items.map(i => {

        // must map this to get products in object format below
        // {...i.product._doc} will give the document for the respective id (products hold mongodb id)
        return {quantity: i.quantity, product: {...i.product._doc}};

      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });

      return order.save();

    })
    .then(result =>{
      return req.user.clearCart();
    })
    .then(result =>{
      res.redirect('/orders');
    })
    .catch(err => serverError(err, res));
};

exports.getOrders = (req, res, next) => {

  Order.find({'user.userId': req.user._id})
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,

      });
    })
    .catch(err => serverError(err, res));
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  const invoiceName = `invoice-${orderId}.pdf`;
  const invoicePath = path.join('data','invoices', invoiceName); // data/invoices/[fileName]

  Order.findById(orderId)
  .then(order => {

    if(!order){

      return new Error('Order not found!');

    }

    if(order.user.userId.toString() == req.user._id.toString()){

      const pdfDoc = new pdfConstructor(); // a readable stream that can be streamed

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="'+invoiceName+'"');

      pdfDoc.pipe(fs.createWriteStream(invoicePath)); // makes sure whatever we write is forwarded to the deifined file 
      pdfDoc.pipe(res); // ensures that everything we write is returned to the user in the client

      pdfDoc.fontSize(26).text('Invoice', {
        underline: true
      });

      pdfDoc.text('---------------------------------------------');

      let totalPrice = 0;
      order.products.forEach(prod => { // remember that products is an array of objects with product objects in each
        totalPrice += prod.product.price * prod.quantity;

        pdfDoc.fontSize(14).text(`${prod.product.title} - R${prod.product.price} * ${prod.quantity}`);

      });

      pdfDoc.text('--------------');


      pdfDoc.fontSize(20).text(`R${totalPrice}`);

      pdfDoc.end();

      // The below way to read a file eats too much memory and takes time if the file is large, because reading must complete before data is returned
      // fs.readFile(invoicePath, (err, data)=>{

      //   if(err){
      //     console.log('gets here err!');

      //     return   const status = error.statuscode || 500;
  const message = error.message;

  // redirect error page
  res.status(status).render('error', {
    path: '/error',
    pagetitle: 'error!',
    status: status,
    message: message

  }); // go to next middleware carrying the error for catching in catch block
      //   }
    
      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader('Content-Disposition', 'inline; filename="'+invoiceName+'"'); // replace inline with attachement and the file is downloaded instead of viewed on the web
    
      //   res.send(data);
      // });

      // this method is better at handling large files as it streams chunks to client
      // const file = fs.createReadStream(invoicePath);

      // res.setHeader('Content-Type', 'application/pdf');
      // res.setHeader('Content-Disposition', 'inline; filename="'+invoiceName+'"');

      // file.pipe(res); // write the data into the response object


    }else{
      return new Error('Not Authorized!'); 
    }

  })
  .catch(err => serverError(err, res));

};
