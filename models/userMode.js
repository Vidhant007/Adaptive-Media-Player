// ----------------- MODULES IMPORT -----------------
const mongoose = require("mongoose");

// ----------------- CREATING SCHEMA -----------------
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true,"please provide a username"],
    minlength: 3,
    maxlenth: 50,
  },
  phone: {
    type: Number,
    required: [true,"please provide a phone number"],
    minlength: 10,
    maxlenth: 50,
  },
  email: {
    type: String,
    required: [true,"please provide an email address"],
    minlength:3,
    maxlenth: 50,
    match:[
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'please provide valid email'
    ],
    unique:true,
  }, 
  password: {
    type: String,
    required: [true,"please provide a password"],
    minlength: 6,
    maxlenth: 50,
  } 
});

module.exports = mongoose.model('User',userSchema);