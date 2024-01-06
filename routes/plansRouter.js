const express = require('express');
const PLAN = express.Router();

const {CREATEPLAN,DELETEPLAN,UPDATEPLAN,GETPLANS} = require('../controllers/plansController');
const {AUTHENTICATION} = require('../middleware/authentication');
PLAN.post('/createplan',CREATEPLAN);
PLAN.get('/getplans',AUTHENTICATION,GETPLANS);
PLAN.patch('/updateplan/:id',UPDATEPLAN);
PLAN.delete('/deleteplan/:id',DELETEPLAN);

module.exports = {
    PLANSROUTER : PLAN,
}