const {StatusCodes} = require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const PROFILE = require('../models/profileModel');
const USER  = require('../models/userModel');
const SUBSCRIPTION = require('../models/subscriptionModel');


const registerUser = async (req,res)=>{
    try{
        const {username,phone,email,password} = req.body;

        if (!username || !phone || !email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Missing required fields' });
        }


        //checking if user is already exists
        const existingUser = await USER.findOne({
            $or: [
              { phone: phone },
              { email: email }
            ]
          });
      
          if (existingUser) {
            const errorResponse = {};
      
            if (existingUser.phone === phone) {
              errorResponse.phone = 'Phone number is already registered';
            }
      
            if (existingUser.email === email) {
              errorResponse.email = 'Email is already registered';
            }
      
            return res.status(StatusCodes.BAD_REQUEST).json({ error: errorResponse });
          }

          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
        
          //creating a default profile for user
          const profile = await PROFILE.create({ profileName: username, profileAcess: 3 });
          //create default subscription status for  user
          const subscription = await SUBSCRIPTION.create({startDate: Date.now(),endDate: Date.now(),price:0,isSubscribed:false});

          const tempUser = {
            username,
            phone,
            email,
            password: hashedPassword,
            profiles: [profile._id], // Add the default profile to the user's profiles array
            subscriptionId: subscription._id,
          };

          const user = await USER.create({...tempUser});

          const token = jwt.sign({userId:user._id,name:user.username},process.env.JWT_SECRET,{
            expiresIn:process.env.JWT_LIFETIME,
          })

          res.status(StatusCodes.CREATED).send({user: {name:user.username},token})

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