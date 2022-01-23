const path = require('path');

const express = require('express');

const productController = require('../controllers/shop'); // import products controller

const router = express.Router();

/////////////////////////////////////////////////////////////////////////////
//  path is the one used to access ejs on link href/ action on post form.  //
/////////////////////////////////////////////////////////////////////////////

// / => GET
router.get('/', productController.getIndex);

// /products => GET
router.get('/products', productController.getProducts);

// /products/:productId => GET
router.get('/products/:productId', productController.getProduct); 
//This is a special route that handles dynamic routes with variable productId

// /cart => GET
router.get('/cart', productController.getCart);

// /shop/cart => POST
router.post('/cart', productController.postCart);

// /shop/delete-cart-product => POST
router.post('/delete-cart-product', productController.postDeleteCart);

// /checkout => GET
router.get('/checkout', productController.getCheckout);

// /orders => GET
router.get('/orders', productController.getOrders);



module.exports = router;
