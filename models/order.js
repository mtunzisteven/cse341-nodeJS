const mongoose = require('mongoose'); // import mongoose
const Schema = mongoose.Schema; // store schema 

const orderSchema = new Schema({

  products:
    [
      {
        product: {type: Object, required: true},
        quantity: {type: Number, required: true}
      }
    ],
    user: {
      email: {
        type: String,
        required: true
      },
      userId: {
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
      }
    }
});

// order arg is a name we give to our exported schema | Caps first letter
// this same name is used to create a collection in db | order creates orders, Cat creates cats
module.exports = mongoose.model('Order', orderSchema); // this export connects the model with the schema
