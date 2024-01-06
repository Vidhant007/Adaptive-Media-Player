const express = require('express');
const PLAN = express.Router();

const {CREATEPLAN,DELETEPLAN,UPDATEPLAN,GETPLANS} = require('../controllers/plansController');

PLAN.post('/createplan',CREATEPLAN);
PLAN.get('/getplans',GETPLANS);
PLAN.patch('/updateplan/:id',UPDATEPLAN);
PLAN.delete('/deleteplan/:id',DELETEPLAN);

module.exports = {
    PLANSROUTER : PLAN,
}