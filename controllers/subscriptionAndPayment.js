const upgradePlan = async(req,res)=>{
    res.send('Upgrade Plan Controller');
}

const unsubscribePlan = async (req,res)=>{
    res.send('Unsubscribe Plan');
}


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
    UPGRADEPLAN:upgradePlan,
    PAYMENTGATEWAYCONTROLLER:paymentGatewayController,
    GETCURRENTPLAN:getCurrentSubscriptionPlan,
    GETPREVIOUSPAYMENTS:getPreviousPayments,
    UNSUBSCRIBEPLAN:unsubscribePlan
}