const express = require('express');
const USER = express.Router();

const {LOGINUSER,REGISTERUSER,EDITUSER,DELETEACCOUNT} = require('../controllers/userController');


USER.post('/register',REGISTERUSER);
USER.post('/login',LOGINUSER);
USER.delete('/delete-account/:id',DELETEACCOUNT);
USER.patch('/edit-user/:id',EDITUSER);

module.exports = {
    USERROUTER :USER
};