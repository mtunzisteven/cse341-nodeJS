const fs = require('fs');
const path = require('path');

// define file storage path to be used in data saving and data retrieval
const p = path.join(
    path.dirname(process.mainModule.filename), 
    'data', // data folder where we stored our JSON
    'products.json' // the actual JSON file we're writing data into / this could be an http path to an online resource
    ); // getting the data folder 

module.exports = class Product{ // the class we'll export

    // title is what stands for product in our code
    constructor(id, title, imgUrl, price, description){
        this.id = id;
        this.title = title;
        this.imgUrl = imgUrl;
        this.description = description;
        this.price = price;
    }

    save(){

        getProductsFromFile(products => { // define array for products as arg

            if(this.id){ // don't create new prod if id exists already(edit-product operation)
                const existingProductIndex = products.findIndex(prod => prod.id === this.id); // We find the index for the product we're trying to update. (prod => prod.id) part is key based on products.products array
                const updatedProducts = [...products]; // pull all elements of products and add them to new array: existingProducts
                updatedProducts[existingProductIndex] = this; // the object is an updated product, so replace the old version with the new one.
                fs.writeFile(p, JSON.stringify(updatedProducts), err =>{ // storing that list inside p from above, which is a JSON file
                    console.log(err);
                });
            }
            else{ // create a new product if no id was found(add-product operation)

                this.id = Math.random().toString(); // add a random number as an id
                products.push(this); // adding the created object to the products array
                fs.writeFile(p, JSON.stringify(products), err =>{ // storing that list inside p from above, which is a JSON file
                    console.log(err);
                });
            }
        });
    }

    static deleteProductById(id){
        getProductsFromFile(products => { // define array for products as arg

            const existingProductIndex = products.findIndex(prod => prod.id === id); // We find the index for the product we're trying to update. (prod => prod.id) part is key based on products.products array
            const updatedProducts = [...products]; // pull all elements of products and add them to new array: existingProducts
            updatedProducts.splice(existingProductIndex, 1); // remove the product from the array by index

            fs.writeFile(p, JSON.stringify(updatedProducts), err =>{ // storing that list inside p from above, which is a JSON file
                console.log(err);
            });
        });
    }

    static fetchAll(cb){ // cb : callback to call callback arrow fn below. 

        getProductsFromFile(cb);

    }

    static fetchById(id, cb){ // cb : callback to call callback arrow fn below. 

        getProductsFromFile(products => { // define array for products as arg
           const product = products.find(p => p.id === id); // find product in products "p", where the product id is the same as the id above
           cb(product); // call back with the product returned in above line
        });
    }
}

    
function getProductsFromFile(cb){// cb : callback to call callback arrow fn below. 

    fs.readFile(p, (err, fileContent)=>{ // The arrow fun is registered and fetch returns nothing. We need to call back the arrow fn to have it return someting
        if(err){

            return cb([]); // empty array returned if there's an error

        }else{

            cb(JSON.parse(fileContent)); // when no error and content retrieval complete, the array format of JSON returned

        }

    });
}