const User = require('../models/userModel');
const {StatusCodes} = require('http-status-codes');


const registerUser = async (req,res)=>{
    const {username,phone,email,password} = req.body;
    const tempUser = {username,phone,password,email};
    const user = await User.create({...tempUser});
    res.status(StatusCodes.CREATED).send({user});

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