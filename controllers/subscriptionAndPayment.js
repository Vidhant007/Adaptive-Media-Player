const { StatusCodes } = require("http-status-codes");
const USER = require("../models/userModel");
const SUBSCRIPTION = require("../models/subscriptionModel");
const PLAN = require("../models/plansModel");


const selectPlan = async(req,res)=>{
    try{
        // get userId  to find associated subscription and PlanId to get the plan
        const { userId, planId } = req.params;

        if (!userId || !planId) {
            return res.status(StatusCodes.BAD_REQUEST).send("Provide UserID and PlanID as Params");
        }

        // check if user exists
        const user = await USER.findById(userId);
        if(!user){
            return  res.status(StatusCodes.NOT_FOUND).send("User does not exist");
        }

        // Check if the plan exists
        const plan = await PLAN.findById(planId);
        if (!plan) {
            return res.status(StatusCodes.NOT_FOUND).send("Plan does not exist");
        }

        //add payment gateway

        //calculate the new enddate based on plan's duration
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + plan.duration);

        //if user and plan exists modify subscription
        const subscription = await SUBSCRIPTION.findByIdAndUpdate(user.subscriptionId,{
            planId: plan._id,
            planName : plan.planName,
            startDate: Date.now(),
            endDate: endDate,
            price: plan.price,
            isSubscribed: true,
        },{new:true});

        if(subscription){
            res.status(StatusCodes.CREATED).json({ message: "Plan selected successfully", subscription: subscription });
        }else{
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error Selecting Plan");
        }

    }catch(error){
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error Selecting Plan");
    }
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

const getCurrentSubscriptionPlan = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).send("Provide UserID as Params");
        }

        // check if user exists
        const user = await USER.findById(userId);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).send("User does not exist");
        }

        const subscription = await SUBSCRIPTION.findById(user.subscriptionId);

        if (subscription) {
            return res.status(StatusCodes.OK).json({ subscription: subscription });
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error Fetching Plan");
        }
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error Fetching subscriptionPlan");
    }
};



module.exports = {
    SELECTPLAN:selectPlan,
    UPGRADEPLAN:upgradePlan,
    PAYMENTGATEWAYCONTROLLER:paymentGatewayController,
    GETCURRENTPLAN:getCurrentSubscriptionPlan,
    UNSUBSCRIBEPLAN:unsubscribePlan
}