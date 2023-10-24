const express = require('express');
const USER = express.Router();

const {LOGINUSER,REGISTERUSER,EDITUSER,DELETEACCOUNT} = require('../controllers/userController');


USER.post('/register',REGISTERUSER);
USER.post('/login',LOGINUSER);
USER.delete('/delete-account',DELETEACCOUNT);
USER.patch('/edit-user',EDITUSER);

module.exports = {
    USERROUTER :USER
};