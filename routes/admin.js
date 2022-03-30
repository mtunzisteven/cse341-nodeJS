const express = require('express');
const {check, body} = require('express-validator'); // import check method of express validator sub package

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth'); // bring is-auth.js file to scope

const router = express.Router();

// // /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct); //  adminController.getAddProduct funnelled through isAuth

// // /admin/products => GET
router.get('/products', isAuth, adminController.getProducts); //  adminController.getProducts funnelled through isAuth

// // /admin/add-product => POST
router.post(
    '/add-product', 
    [
        body( 
            'title', // req.body.title value being validated here
            'Title must be between 8 and 36 characters' // error message displayed
            )
            .isLength({min: 8})
            .isLength({max: 36}), 
        body( 
            'description', // req.body.title value being validated here
            'Title must be between 36 and 260 characters' // error message displayed
            )
            .isLength({min: 36})
            .isLength({max: 260}), 
        check('price')
            .isNumeric()
            .withMessage('Price must be a whole number')
    ],
    isAuth, 
    adminController.postAddProduct
); //  adminController.postAddProduct funnelled through isAuth

// // /admin/edit-product => GET
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct); //  adminController.getEditProduct funnelled through isAuth

// // /admin/add-product => POST
router.post(
    '/edit-product', 
    [
        body( 
            'title', // req.body.title value being validated here
            'Title must be between 8 and 36 characters' // error message displayed
            )
            .isLength({min: 8})
            .isLength({max: 36}), 
        body( 
            'description', // req.body.title value being validated here
            'Title must be between 36 and 260 characters' // error message displayed
            )
            .isLength({min: 36})
            .isLength({max: 260}), 
        check('price')
            .isNumeric()
            .withMessage('Price must be a whole number')
    ],
    isAuth, 
    adminController.postEditProduct
); //  adminController.postEditProduct funnelled through isAuth

// // /admin/product/:productId => DELETE
router.delete('/product/:productId', isAuth, adminController.deleteProduct); //  adminController.deleteProduct funnelled through isAuth

module.exports = router;
