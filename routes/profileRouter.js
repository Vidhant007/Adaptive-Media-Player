const express = require('express');
const PROFILE = express.Router();

const {GETPROFILES,GETUSERPROFILE,DELETEUSERPROFILE,UPDATEUSERPROFILE,CREATEUSERPROFILE} = require('../controllers/profilesController');


PROFILE.post('/create-profile/:id',CREATEUSERPROFILE);
PROFILE.get('/get-profiles/:id',GETPROFILES);
PROFILE.patch('/update-profile',UPDATEUSERPROFILE);
PROFILE.delete('/delete-profile',DELETEUSERPROFILE);

module.exports = {
    PROFILESROUTER : PROFILE,
}