const { StatusCodes } = require('http-status-codes');
const PROFILE = require('../models/profileModel');
const USER = require('../models/userModel');

const getProfiles = async(req,res) =>{
    res.send('Get Profiles');
}

const getUserProfile = async(req,res)=>{
    res.send('Get user Profile');
}

const createUserProfile = async (req, res) => {
    try {
      const { id } = req.params;
      const { profileName, profileAcess } = req.body;
  
      if (!profileAcess || !profileName) {
        return res.status(StatusCodes.BAD_REQUEST).send("Provide ProfileName and ProfileAcess in req.body");
      }
  
      if (!id) {
        return res.status(StatusCodes.FORBIDDEN).send("User ID not provided as Params");
      }
  
      // Checking if user exists
      const user = await USER.findById(id);
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).send("User not found");
      }
  
      // Checking if profile with the same name already exists
      const existingProfile = await PROFILE.findOne({ profileName: profileName });
      if (existingProfile) {
        return res.status(StatusCodes.CONFLICT).send("Profile with the same name already exists");
      }
  
      // Create profile
      const profile = await PROFILE.create({ profileName: profileName, profileAcess: profileAcess });
  
      // Add profile to user
      await USER.findByIdAndUpdate(id, { $push: { profiles: profile._id } });
  
      res.status(StatusCodes.CREATED).json({ profile: profile });
    } catch (error) {
      console.error(error);
        res.status(Status.INTERNAL_SERVER_ERROR).send('Error Creating New User Profile');
    }
  };
  
  

const deleteUserProfile = async(req,res)=>{
    res.send('Delete Profile');
}

const updateUserProfile = async(req,res)=>{
    //changing acess rights and privileges of a user
    //what type of content they can see
    res.send("Update User Profile");
}

module.exports = {
    GETUSERPROFILE:getUserProfile,
    GETPROFILES:getProfiles,
    DELETEUSERPROFILE:deleteUserProfile,
    UPDATEUSERPROFILE:updateUserProfile,
    CREATEUSERPROFILE:createUserProfile,
}