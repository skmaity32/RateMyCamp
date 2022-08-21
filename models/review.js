const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    rating: Number,
    body: String
})

module.exports = new mongoose.model('Review', reviewSchema);