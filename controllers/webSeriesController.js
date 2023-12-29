const path = require('path');
const fs = require('fs');
const fs_promise = require('fs').promises; 
const multer = require('multer');
const {StatusCodes} = require('http-status-codes');

//IMPORTING TRANSCODINGSCRIPT RUNNER
const {RUNTRANSCODINGSCRIPT} = require('../transcoder/transcoder');

// IMPORTING MODELS
const SERIES = require('../models/seriesModel');
const SEASON = require('../models/seasonsModel');
const EPISODE = require('../models/episodeModel');

//multer storage
const Storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = file.fieldname + '-' + uniqueSuffix + ext;
        cb(null, fileName);
    }
});

const upload = multer({
    storage:Storage
}).fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]);

// ==========CONTROLLERS==========================================================

// creating Series
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