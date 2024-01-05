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
          const profile = await PROFILE.create({ profileName: username, profileAcess: 3,isMasterProfile:true });
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
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(StatusCodes.NOT_FOUND).send('please provide email and password');
        }

        const user = await USER.findOne({email: email});
        if(!user){
            return res.status(StatusCodes.NOT_FOUND).send("User Not Registered!");
        }

        //checking if password is correct
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect) {
            return res.status(StatusCodes.BAD_REQUEST).send('Invalid Credentials');
        }

        const token = jwt.sign({userId:user._id,name:user.username},process.env.JWT_SECRET,{
            expiresIn:process.env.JWT_LIFETIME,
          });

          res.status(StatusCodes.OK).json({user:{name:user.username},token});

        }catch (error){
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error logging In !');
    }
}

const editUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { username, phone, email, password } = req.body;
  
      if (!id) {
        return res.status(StatusCodes.FORBIDDEN).send("User ID not provided");
      }
  
      const user = await USER.findById(id);
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).send("User not found");
      }

         // Check if at least one field is present in the request body
      if (!username && !phone && !email && !password) {
        return res.status(StatusCodes.BAD_REQUEST).send("At least one field (username, phone, email, password) must be provided for update");
      }
  
      const updateObject = {};
      if (username !== undefined) {
        updateObject.username = username;
      }
      if (phone !== undefined) {
        updateObject.phone = phone;
      }
      if (email !== undefined) {
        updateObject.email = email;
      }
      if (password !== undefined) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updateObject.password = hashedPassword;
      }
  
      const updatedUser = await USER.findOneAndUpdate({ _id: id }, updateObject, { new: true });
  
      if (updatedUser) {
        return res.status(StatusCodes.OK).send(`User Updated: ${updatedUser}`);
      } else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error Updating User");
      }
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error Editing User Details");
    }
  };
  

const deleteAccount = async(req,res)=>{
    try{
        const {id} = req.params;

        if (!id) {
            return res.status(StatusCodes.FORBIDDEN).send("User ID not provided");
          }

        //check if user exists
        const user = await USER.findById(id);

        if (!user) {
          return res.status(StatusCodes.NOT_FOUND).send("User not found");
        }
          
        //delete all associated profiles
        const profileIds = user.profiles;
        if (profileIds && profileIds.length > 0) {
            await PROFILE.deleteMany({ _id: { $in: profileIds } });
          }

        // Delete the user's subscription
        await SUBSCRIPTION.findByIdAndDelete(user.subscriptionId);

        // Delete the user
        await USER.findByIdAndDelete(id);
        return res.status(StatusCodes.OK).send({
            message: "User, associated profiles, and subscription deleted successfully",
            deleted: user,
          });
    }catch(error){
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error Deleting User Account");
    }
}

module.exports={
    REGISTERUSER : registerUser,
    LOGINUSER : loginUser,
    EDITUSER : editUser,
    DELETEACCOUNT : deleteAccount,
}