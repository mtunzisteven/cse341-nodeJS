const express = require('express');

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth'); // bring is-auth.js file to scope

const router = express.Router();

// // /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct); //  adminController.getAddProduct funnelled through isAuth

// // /admin/products => GET
router.get('/products', isAuth, adminController.getProducts); //  adminController.getProducts funnelled through isAuth

// // /admin/add-product => POST
router.post('/add-product', isAuth, adminController.postAddProduct); //  adminController.postAddProduct funnelled through isAuth

// // /admin/edit-product => GET
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct); //  adminController.getEditProduct funnelled through isAuth

// // /admin/add-product => POST
router.post('/edit-product', isAuth, adminController.postEditProduct); //  adminController.postEditProduct funnelled through isAuth

// // /admin/delete-product => POST
router.post('/delete-product', isAuth, adminController.postDeleteProduct); //  adminController.postDeleteProduct funnelled through isAuth

module.exports = router;
