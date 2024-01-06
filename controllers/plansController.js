const { StatusCodes } = require("http-status-codes");
const PLAN = require("../models/plansModel");

const createPlan = async (req,res) =>{
    try{
        const {planName,duration,price,description} = req.body;

        if(!planName || !duration || !price || !description){
            return res.status(StatusCodes.BAD_REQUEST).send("Provide PlanName, Duration, Price and Description");
        }

        const plan = await PLAN.findOne({planName:planName});
        if(plan){
            return res.status(StatusCodes.CONFLICT).send('PlanName Already Exists')
        }

        const newPlan = await PLAN.create({planName:planName,duration:duration,price:price,description:description});
        res.status(StatusCodes.OK).send(`Plan created successfully ${newPlan}`);

    }catch(error){
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error Creating New Plan');
    }
}

const getPlans = async (req,res) =>{
    try{
        const plans = await PLAN.find();
        res.status(StatusCodes.OK).json(plans);
    }catch(error){
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error Getting Plans');
    }
};

const deletePlan = async (req,res) =>{
    res.send('Delete Plan');
};

const updatePlan = async (req,res) =>{
    res.send('Update Plan');
};

module.exports = {
    CREATEPLAN:createPlan,
    GETPLANS:getPlans,
    DELETEPLAN:deletePlan,
    UPDATEPLAN:updatePlan
}

