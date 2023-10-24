const registerUser = async (req,res)=>{
    res.send('Register User');
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