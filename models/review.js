const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    rating: Number,
    body: String
})

module.exports = new mongoose.model('Review', reviewSchema);