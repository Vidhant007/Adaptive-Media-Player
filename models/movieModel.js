const mongoose = require('mongoose');
const path = require('path');

const movieSchema = new mongoose.Schema({
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
        min: 0, // Adjusted minimum value
        max: 10, // Adjusted maximum value
    },
    images: [
        {
            data: Buffer, //storing images in mongodb
            contentType: String,
        }
    ],
    videoPath: {
        type: String,
    },
});

// Add a pre-save middleware to calculate videoPath
// movieSchema.pre('save', function (next) {
//     // Calculate videoPath based on title
//     this.videoPath = path.join(__dirname, '..', 'Movies', this.title);
//     next();
// });

module.exports = mongoose.model('Movie', movieSchema);
