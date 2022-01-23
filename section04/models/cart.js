const fs = require('fs');
const path = require('path');
const Product = require('./product');

// define file storage path to be used in data saving and data retrieval
const p = path.join(
    path.dirname(process.mainModule.filename), 
    'data', // data folder where we stored our JSON
    'cart.json' // the actual JSON file we're writing data into / this could be an http path to an online resource
    ); // getting the data folder 


module.exports = class Cart{ // the class we'll export


    static addProduct(id, productPrice){
        // fetch current cart
        fs.readFile(p, (err, fileContent) => { // read cart.JSON and have cb where we either get error or file content

            let cart = {products: [], totalPrice:0}; // initially must have empty products array and total price of 0

            if(!err){
                cart = JSON.parse(fileContent); // if we get no error, we parse cart contents in cart 
            }

            // analyze cart => find existing product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id); // We find the index for the product we're trying to add in the cart array. (prod => prod.id) part is key based on cart.products array
            const existingProduct = cart.products[existingProductIndex]; // use the index above to get the product from the cart array

            // add new product increase quantity
            let updatedProduct;

            if(existingProduct){ // if we find the product already exists in the cart

                updatedProduct = {...existingProduct }; // We make into an object to access its properties
                updatedProduct.qty = updatedProduct.qty +1; // then we increase its qty property by 1 | existing product already has qty and id properties
                cart.products = [...cart.products]; // put cart in array. Already is an array thought?
                cart.products[existingProductIndex] = updatedProduct; // replace the Product at the defined index with the updated product 

            }else{

                updatedProduct = { id: id, qty:1}; // if the poruct didn't already exist in the cart, we simply add it
                cart.products = [...cart.products, updatedProduct]; // then we add the new, or new product into the cart array

            }

            cart.totalPrice = cart.totalPrice + +productPrice; //Finally, we must update the cart total price to include the new productPrice

            // Save updated cart to file
            fs.writeFile(p, JSON.stringify(cart), (err) => {

                console.log(err);

            });
        });
    }

    save(){

    }

    static fetchAll(cb){ // cb : callback to call callback arrow fn below. 

        getProductsFromFile(cb);

    }

    
    static deleteCartProductById(id, productPrice){

          // fetch current cart
          fs.readFile(p, (err, fileContent) => { // read cart.JSON and have cb where we either get error or file content

            if(err){

                return; 

            }else{

                const updatedCart = {...JSON.parse(fileContent)};

                const product = updatedCart.products.find(prod => prod.id === id);

                if(!product){
                    return;
                }

                const productQty = product.qty;

                updatedCart.products = updatedCart.products.filter (prod => prod.id !== id);

                updatedCart.totalPrice -= productPrice*productQty;

                
                // Save updated cart to file
                fs.writeFile(p, JSON.stringify(updatedCart), (err) => {

                    console.log(err);

                });

            }
        });

    }

    static fetchProducts(cb){ // cb : callback to call callback arrow fn below. 
        // fetch current cart
        fs.readFile(p, (err, fileContent) => { // read cart.JSON and have cb where we either get error or file content
            const cart = JSON.parse(fileContent);

            if(err){

                cb(null);

            }else{

                cb(cart);

            }
        });

    }
}

