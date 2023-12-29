const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',    },
    profileName:{
        type:String,
    },
    profileAcess:{
        type: Number, //represents various acess levels
    }
})

module.exports = mongoose.model('Profile',profileSchema);