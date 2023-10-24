const express = require('express');
const SUBSCRIPTIONS = express.Router();

const {SELECTPLAN,UPGRADEPLAN,UNSUBSCRIBEPLAN,GETCURRENTPLAN,GETPREVIOUSPAYMENTS,PAYMENTGATEWAYCONTROLLER} = require('../controllers/subscriptionAndPayment');

SUBSCRIPTIONS.post('/choose-plan',SELECTPLAN);
SUBSCRIPTIONS.get('/current-plan',GETCURRENTPLAN);
SUBSCRIPTIONS.get('/previous-plans',GETPREVIOUSPAYMENTS);
SUBSCRIPTIONS.patch('/upgrade-plan',UPGRADEPLAN); //calls to payment gateway middleware
SUBSCRIPTIONS.patch('/unsubscribe-plan',UNSUBSCRIBEPLAN); //turns the plan to inactive state and adds it to previous plans list too. (monthly list)

module.exports = {
    SUBSCRIPTIONSROUTER : SUBSCRIPTIONS
}