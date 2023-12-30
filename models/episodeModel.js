const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
    seriesTitle: {
        type: String,
        required: [true, "Please provide a title"],
        maxlength: 50,
    },
    seasonNumber:{  // helps specify which series episode belongs to
        type: Number,
        required: [true, "Please provide a season number"],
    },
    episodeNumber:{
        type: Number,
        required: [true, "Please provide a episode number"],
    },
    description: {
        type: String,
        required: [true, "Please provide a description"],
        minlength: 3,
        maxlength: 500, // Adjusted max length
    },
    imageUrls: {
        type: [String],
        required: true,
        minlength: 1,
    },
    videoPath: {
        type: String,
    },
    releaseDate:{
        type: Date,
        default: Date.now,
    }
});



module.exports = mongoose.model('Episode', episodeSchema);
