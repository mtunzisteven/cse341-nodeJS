const mongoose = require('mongoose'); //db connection
const Schema = mongoose.Schema; //mongoose schema require

const postSchema = new Schema({

        title: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        CredentialsContainer: {
            type: Object,
            required: false,
        }
    },
    {timestamps: true}

);

module.exports = mongoose.model('Post', postSchema);
