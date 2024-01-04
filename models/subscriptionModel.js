const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
    },
    startDate:{
        type:Date,
    },
    endDate:{
        type:Date,
    },
    price:{
        type:Number,
    },
    isSubscribed:{
        type:Boolean,
    }
})

module.exports = mongoose.model('Subscription',subscriptionSchema);
