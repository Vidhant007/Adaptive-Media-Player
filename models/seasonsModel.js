const mongoose = require('mongoose');

const seasonsSchema = new mongoose.Schema({
    seriesTitle: {
        type: String,
        required: [true, "Please provide a title"],
        maxlength: 50,
    },
    seasonNumber:{
        type:Number,
        required: [true, "Please provide a season number"]
    },
    description: {
        type: String,
        required: [true, "Please provide a description"],
        minlength: 3,
        maxlength: 500, // Adjusted max length
    },
    releaseDate:{
        type: Date,
        default: Date.now,
    },
});



module.exports = mongoose.model('Season', seasonsSchema);
