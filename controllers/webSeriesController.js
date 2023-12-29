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
const addSeries = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        console.log(err);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: 'Error uploading files' });
      }
  
      const images = req.files.images.map((file) => {
        return {
          data: file.filename,
          contentType: file.mimetype,
        };
      });
  
      const newSeries = new SERIES({
        title: req.body.title,
        description: req.body.description,
        genre: req.body.genre,
        rating: req.body.rating,
        images: images,
      });


        try{
            await newSeries.save();
            res.status(StatusCodes.CREATED).json(`Series Created: ${newSeries}`);
        }catch(error){
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error saving series details' });
        }

    });

}

const addSeason = async(req,res)=>{
    try{
        const {seriesTitle,seasonNumber,description,releaseDate} = req.body; 
        const finaldata = {seriesTitle:seriesTitle,
                            seasonNumber:seasonNumber,
                            description:description,
                            releaseDate:releaseDate};

        const season = await SEASON.create(finaldata);
        res.status(StatusCodes.CREATED).send({season});
    } catch(error){
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error saving season' });
    }
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