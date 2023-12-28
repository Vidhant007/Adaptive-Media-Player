const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    profileName:{
        type:String,
    },
    profileAcess:{
        type: Number, //represents various acess levels
    }
})

module.exports = mongoose.model('Profile',profileSchema);