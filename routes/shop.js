const express = require('express');

const shopController = require('../controllers/shop'); // bring shop.js controller file to scope

const isAuth = require('../middleware/is-auth'); // bring is-auth.js file to scope

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct); 

router.get('/cart', isAuth, shopController.getCart); //  shopController.getCart funnelled through isAuth

router.post('/cart', isAuth, shopController.postCart); //  shopController.postCart funnelled through isAuth

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct); //  shopController.postCartDeleteProduct funnelled through isAuth

router.post('/create-order', isAuth, shopController.postOrder); //  shopController.postOrder funnelled through isAuth

router.get('/orders', isAuth, shopController.getOrders); //  shopController.getOrders funnelled through isAuth

router.get('/orders/:orderId', isAuth, shopController.getInvoice); //  shopController.getInvoice funnelled through isAuth

module.exports = router;
