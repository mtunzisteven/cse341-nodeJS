const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a product schema to let mongoose know how data will look(data definition)
const productSchema = new Schema({
  // title: String gives a version of the title where we can add product without title
  // the versions below ensure that product entered always has the required fields

  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imgUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,  // call schema to describe id type of mongoDb
    ref: 'User', // referes to mongodb id in User model | relation : not used when docs embedded
    required: true
  }

});

// Product arg is a name we give to our exported schema | Caps first letter
// this same name is used to create a collection in db | Product creates products, Cat creates cats
module.exports = mongoose.model('Product', productSchema); // this export connects the model with the schema