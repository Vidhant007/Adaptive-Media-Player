const selectPlan = async(req,res)=>{
    // selects plan from  existing plan by getting plan id and facilitating payment
    res.send('Select Plan');
}

const upgradePlan = async(req,res)=>{
    //upgrads current plan to new plan and facilitates payment
    res.send('Upgrade Plan Controller');
}

const unsubscribePlan = async (req,res)=>{
    //unsubscribe plan (makes it void)
    res.send('Unsubscribe Plan');
}

//can be called inside other functions ?? still experimental
const paymentGatewayController = async(req,res)=>{
    res.send("Payment Gateway Controller");
}

const getCurrentSubscriptionPlan = async(req,res)=>{
    res.send("Get Current Plan");
}

const getPreviousPayments = async(req,res)=>{
    res.send("Get Previous Plans");
}

module.exports = {
    SELECTPLAN:selectPlan,
    UPGRADEPLAN:upgradePlan,
    PAYMENTGATEWAYCONTROLLER:paymentGatewayController,
    GETCURRENTPLAN:getCurrentSubscriptionPlan,
    GETPREVIOUSPAYMENTS:getPreviousPayments,
    UNSUBSCRIBEPLAN:unsubscribePlan
}