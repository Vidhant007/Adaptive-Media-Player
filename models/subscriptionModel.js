const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
    },
    planId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
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
