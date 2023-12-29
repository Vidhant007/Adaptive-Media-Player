const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    minlength: 3,
    maxlength: 50, // Corrected property name
  },
  phone: {
    type: Number,
    required: [true, "Please provide a phone number"],
    minlength: 10,
    maxlength: 50, // Corrected property name
  },
  email: {
    type: String,
    required: [true, "Please provide an email address"],
    minlength: 3,
    maxlength: 50, // Corrected property name
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    maxlength: 50, // Corrected property name
  },
  profiles:{
    
  },
  subscriptionId:{

  },
  isSubscribed:{
    
  }
});

module.exports = mongoose.model('User', userSchema);
