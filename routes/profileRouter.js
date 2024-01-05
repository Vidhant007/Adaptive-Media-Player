const express = require('express');
const PROFILE = express.Router();

const {GETPROFILES,DELETEPROFILE,UPDATEPROFILEACESS,CREATEUSERPROFILE} = require('../controllers/profilesController');


PROFILE.post('/create-profile/:id',CREATEUSERPROFILE);
PROFILE.get('/get-profiles/:id',GETPROFILES);
PROFILE.patch('/update-profileAcess/:id',UPDATEPROFILEACESS);
PROFILE.delete('/delete-profile/:id',DELETEPROFILE);

module.exports = {
    PROFILESROUTER : PROFILE,
}