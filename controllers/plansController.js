const createPlan = async (req,res) =>{
    res.send('Create Plan');
}

const getPlans = async (req,res) =>{
    res.send('Get Plans');
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

