const {StatusCodes} = require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const PROFILE = require('../models/profileModel');
const USER  = require('../models/userModel');
const SUBSCRIPTION = require('../models/subscriptionModel');


const registerUser = async (req,res)=>{
    try{
        const {username,phone,email,password} = req.body;

        //checking if user is already exists
        const existingUser = await USER.findOne({
            $or: [
              { username: username },
              { phone: phone },
              { email: email }
            ]
          });    


          if (existingUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'User already exists' });
          }

          




        }catch(error){
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error Creating User");
    }
}

const loginUser = async(req,res)=>{
    res.send('Login User');
}


const editUser = async(req,res)=>{
    res.send('Edit User');
}

const deleteAccount = async(req,res)=>{
    res.send('Deleted User');
}

module.exports={
    REGISTERUSER : registerUser,
    LOGINUSER : loginUser,
    EDITUSER : editUser,
    DELETEACCOUNT : deleteAccount,
}