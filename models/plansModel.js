const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    planName:{
        type: String,
        required: true,
        unique: true,
    },
    duration:{
        type: Number, // 1 month, 6 months, 12 months etc
        required: true,
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