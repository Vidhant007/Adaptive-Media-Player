const getProfiles = async(req,res) =>{
    res.send('Get Profiles');
}

const getUserProfile = async(req,res)=>{
    res.send('Get user Profile');
}

const createUserProfile = async (req,res)=>{
    //includes all profile acess rights and privileges
    res.send('Get Profile');
}

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