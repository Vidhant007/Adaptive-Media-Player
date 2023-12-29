const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a title"],
        maxlength: 50,
    },
    description: {
        type: String,
        required: [true, "Please provide a description"],
        minlength: 3,
        maxlength: 500, // Adjusted max length
    },
    genre: {
        type: String,
        required: [true, "Please provide a genre"],
        minlength: 3,
        maxlength: 50,
    },
    rating: {
        type: Number,
        required: [true, "Please provide a rating"],
        min: 0, 
        max: 10, 
    },
    imageUrls: {
        type: [String],
        required: true,
        minlength: 1,
    },
    releaseDate:{
        type: Date,
        default: Date.now,
    },
});



module.exports = mongoose.model('Series', seriesSchema);
