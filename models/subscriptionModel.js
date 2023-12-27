const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    subscriptionId:{
        type:String,
    },
    userId:{
        type:String,
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
