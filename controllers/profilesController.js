const { StatusCodes } = require('http-status-codes');
const PROFILE = require('../models/profileModel');
const USER = require('../models/userModel');

const getProfiles = async(req,res) =>{
    try{
        const { id } = req.params;

        if (!id) {
            return res.status(StatusCodes.FORBIDDEN).send("User ID not provided as Params");
          }

        // checking if user exists
        const user = await USER.findById(id);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).send("User not found");
        }

         // If user exists, get all associated profiles
        const profiles = await PROFILE.find({ _id: { $in: user.profiles } });

        // Send success response with profiles
        res.status(StatusCodes.OK).json({ profiles: profiles });

    } catch (error) {
      console.error(error);
        res.status(Status.INTERNAL_SERVER_ERROR).send('Error Getting User Profiles');
    }

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

          // Get user profiles
    const profiles = await PROFILE.find({ _id: { $in: user.profiles } });


  
    // Checking if profile with the same name already exists for that user
    const existingProfile = profiles.find((profile) => profile.profileName === profileName);

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
  
  

  const deleteProfile = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(StatusCodes.FORBIDDEN).send("Profile ID not provided as Params");
        }

        const profile = await PROFILE.findById(id);

        if (!profile) {
            return res.status(StatusCodes.NOT_FOUND).send("Profile not found");
        }

        // Check if the profile is a master profile
        if (profile.isMasterProfile) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: "Master profile cannot be deleted" });
        }

        // If the profile is not a master profile, delete it
        const deletedProfile = await PROFILE.findByIdAndDelete(id);

        if (deletedProfile) {
            res.status(StatusCodes.OK).json({ message: "Profile deleted successfully" });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error deleting profile" });
        }

    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error Deleting Profile');
    }
}


const updateUserProfile = async(req,res)=>{
    //changing acess rights and privileges of a user
    //what type of content they can see
    res.send("Update User Profile");
}

module.exports = {
    GETPROFILES:getProfiles,
    DELETEPROFILE:deleteProfile,
    UPDATEUSERPROFILE:updateUserProfile,
    CREATEUSERPROFILE:createUserProfile,
}