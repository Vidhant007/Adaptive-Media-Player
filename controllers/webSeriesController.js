const getSeries = async(req,res)=>{
    res.send("Get Series");
}

const getSeasons = async(req,res)=>{
    res.send("Get Seasons");
}

//runs with a player middleware for both movies and episodes
const getEpisodes = async(req,res)=>{
    res.send('Get Episodes');
}

module.exports = {
    GETEPISODES:getEpisodes,
    GETSEASONS:getSeasons,
    GETSERIES:getSeries
}