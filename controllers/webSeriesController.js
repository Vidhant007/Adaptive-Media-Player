// creating Series
const Series = require('../models/seriesModel');
const Seasons = require('../models/seasonsModel');

const addSeries = async(req,res)=>{
    const series = await Series.create(req.body);
    res.send({series});
}

const addSeason = async(req,res)=>{
    const season = await Season.create(req.body);
    res.send({season});
}

const addEpisode = async(req,res)=>{
    res.send('Add episodes');
}

//getting series data
const getSeries = async(req,res)=>{
    res.send("Get Series");
}

const getSeasons = async(req,res)=>{
    res.send("Get Seasons");
}

const getEpisodes = async(req,res)=>{
    res.send('Get Episodes');
}

// Update Series Data
const updateSeries = async(req,res)=>{
    res.send('Update Series');
};

const updateSeason = async(req,res)=>{
    res.send('Update Series');
};

const updateEpisode = async(req,res)=>{
    res.send('Update Episode');
};


// Remove Series Data 
const removeSeries = async(req,res)=>{
    res.send('Remove Series');
};

const removeSeason = async(req,res)=>{
    res.send('Remove Seasons');
};

const removeEpisode = async(req,res)=>{
    res.send('Remove Episode');
};


module.exports = {
    GETEPISODES:getEpisodes,
    GETSEASONS:getSeasons,
    GETSERIES:getSeries,
    REMOVEEPISODE:removeEpisode,
    REMOVESEASON:removeSeason,
    REMOVESERIES:removeSeries,
    ADDEPISODE:addEpisode,
    ADDSEASON:addSeason,
    ADDSERIES:addSeries,
    UPDATEEPISODE:updateEpisode,
    UPDATESEASON:updateSeason,
    UPDATESERIES:updateSeries
}