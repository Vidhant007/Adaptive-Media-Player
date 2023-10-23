const registerUser = async (req,res)=>{
    res.send('Register User');
}

const loginUser = async(req,res)=>{
    res.send('Login User');
}

const profiles = async(req,res)=>{
    res.send('Profiles');
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
    PROFILES : profiles,
    EDITUSER : editUser,
    DELETEACCOUNT : deleteAccount,
}