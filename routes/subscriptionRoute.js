const express = require('express');
const SUBSCRIPTIONS = express.Router();

const {SELECTPLAN,UPGRADEPLAN,UNSUBSCRIBEPLAN,GETCURRENTPLAN,GETPREVIOUSPAYMENTS,PAYMENTGATEWAYCONTROLLER} = require('../controllers/subscriptionAndPayment');

SUBSCRIPTIONS.patch('/choose-plan/:userId/:planId', SELECTPLAN);
SUBSCRIPTIONS.get('/current-plan/:userId',GETCURRENTPLAN);
SUBSCRIPTIONS.patch('/upgrade-plan/:userId/:newPlanId',UPGRADEPLAN); //calls to payment gateway middleware
SUBSCRIPTIONS.patch('/unsubscribe-plan/:userId',UNSUBSCRIBEPLAN); //turns the plan to inactive state and adds it to previous plans list too. (monthly list)

module.exports = {
    SUBSCRIPTIONSROUTER : SUBSCRIPTIONS
}

