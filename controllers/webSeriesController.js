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
    upload(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error uploading files' });
        }

        const images = req.files.images.map((file) => {
            return {
                data: file.filename,
                contentType: file.mimetype,
            };
        });

        const videoPath = req.files.video ? path.join('uploads', req.files.video[0].filename) : null;

        const newEpisode = new EPISODE({
            seriesTitle: req.body.seriesTitle,
            seasonNumber: req.body.seasonNumber,
            episodeNumber: req.body.episodeNumber,
            description: req.body.description,
            images: images,
            videoPath: videoPath,
        });
        
        const seriesTitle = newEpisode.seriesTitle.replace(/\s+/g, '_');
        const seasonName = "Season" + newEpisode.seasonNumber.toString();
        const episodeName = "Episode" + newEpisode.episodeNumber.toString();
        const outputDir = path.join('series',seriesTitle,seasonName,episodeName);
        console.log(outputDir);
        
        // Check if the directory exists; create it if not
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        try {
            await newEpisode.save();

            if(videoPath){
                await RUNTRANSCODINGSCRIPT(videoPath, outputDir);

                // Update the videoPath in db with trancoded video path
                newEpisode.videoPath = outputDir;
                await newEpisode.save();

                console.log('trancoding completed successfully')

            }
            res.status(StatusCodes.CREATED).json('Successfully uploaded');
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error saving movie details' });
        }
    });
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
    try{
        const {id} = req.params;
        if(!id){
            return res.status(StatusCodes.FORBIDDEN).send('Series ID not Defined');
        }

        //check if series exists
        const series = await SERIES.findById(id);

        if(!series){
            return res.status(StatusCodes.NOT_FOUND).send('Series not found');
        }

        // check if user is authorized
    

        const updated = await SERIES.findOneAndUpdate({_id: id},req.body);

        //send response
        if(updated){
            return res.status(StatusCodes.OK).send(`Series Updated: ${updated}`);
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error Updating Series');
        }
    }catch (error){
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error Updated Series');
    }};

const updateSeason = async(req,res)=>{
    try{
        const {id} = req.params;
        if(!id){
            return res.status(StatusCodes.FORBIDDEN).send('Season ID not Defined');
        }

        //check if season exists
        const season = await SEASON.findById(id);

        if(!season){
            return res.status(StatusCodes.NOT_FOUND).send('Season not found');
        }

        // check if user is authorized
    

        const updated = await SEASON.findOneAndUpdate({_id: id},req.body);

        //send response
        if(updated){
            return res.status(StatusCodes.OK).send(`Season Updated: ${updated}`);
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error Updating Season');
        }
    }catch (error){
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error Updated Season');
    }};

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