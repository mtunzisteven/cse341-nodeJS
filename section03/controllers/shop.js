const Cart = require('../models/cart');
const Product = require('../models/product');


exports.getCart = (req, res, next) => {
  Cart.fetchProducts(cart => {
      Product.fetchAll(products => { // in fetchAll, products passed as empty variable(cb). It eventually is loaded with array of products
          const cartProducts = [];

          for(product of products){
            const cartProductData = cart.products.find(prod => prod.id === product.id);

            if(cartProductData ){
              cartProducts.push({productData: product, qty: cartProductData.qty});
           }
          }
          res.render('shop/cart', { // open cart page
          products: cartProducts, // put products array into prods
          pageTitle: 'Cart',  // the title of the ejs file to render
          path: '/cart', // the path entered on url
        });
      });
    });
  };

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId; // productId is named on routes
  Product.fetchById(prodId, (product) => {

    Cart.addProduct(prodId, product.price);

  });
  res.redirect("/");
};

exports.postDeleteCart = (req, res, next) => {
  const prodId = req.body.productId; // productId is named on routes
  Product.fetchById(prodId, (product) => {

    Cart.deleteCartProductById(prodId, product.price);

  });
  res.redirect("/cart");
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId; // productId is named on routes
    Product.fetchById(prodId, product => { // cb is the arrow fn taking product as arg
      res.render('shop/product-detail', { // open shop page
        product: product, // get product obtained into product key
        pageTitle: product.title,  // the title of the ejs file to render
        path: '/products', // the path entered on url
      });    
    });
  };

  exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => { // in fetchAll, products passed as empty variable(cb). It eventually is loaded with array of products
      res.render('shop/product-list', { // open shop page
      prods: products, // put products array into prods
      pageTitle: "Shop",  // the title of the ejs file to render
      path: '/products', // the path entered on url
    });
  });
  };

  exports.getCheckout = (req, res, next) => {
      res.render('shop/checkout', { // open checkout page
      pageTitle: 'Checkout',  // the title of the ejs file to render
      path: '/checkout', // the path entered on url
    });
  };

  exports.getOrders = (req, res, next) => {
    res.render('shop/orders', { // open orders page
    pageTitle: 'Orders',  // the title of the ejs file to render
    path: '/orders', // the path entered on url
  });
}; 

  exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => { // in fetchAll, products passed as empty variable(cb). It eventually is loaded with array of products
      res.render('shop/index', { // open index page
      prods: products, // put products array into prods
      pageTitle: 'Home',  // the title of the ejs file to render
      path: '/', // the path entered on url
    });
  });
};