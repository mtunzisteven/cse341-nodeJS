// Here we register our pages from the views folder 
// Our perspective is from the routes folder: "/...""
// we get our actual redirections and paths in the admin controller

const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

/////////////////////////////////////////////////////////////////////////////
//  path is the one used to access ejs on link href/ action on post form.  //
/////////////////////////////////////////////////////////////////////////////

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', adminController.postProduct);

// /admin/products => GET
router.get('/admin-products', adminController.getAdminProducts);

// /admin/edit-products => GET
router.get('/edit-product/:productId', adminController.getEditProduct);

// /admin/delete-products => POST 
router.post('/delete-product', adminController.postDeleteProduct);

// /admin/edit-products => POST
router.post('/edit-product', adminController.postEditProduct);

module.exports = router;
