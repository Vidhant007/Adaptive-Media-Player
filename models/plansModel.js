const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    planName:{
        type: String,
        required: true,
        unique: true,
    },
    duration:{
        type: String,
        required: true,
        unique: true,
    },
    price:{
        type: Number,
        required: true,
    },
    description:{
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Plan',planSchema);