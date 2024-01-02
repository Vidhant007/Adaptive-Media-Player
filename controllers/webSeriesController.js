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
    try{
        const series = await SERIES.find();
        res.status(StatusCodes.OK).json({ series: series});
    }catch(error){
        console.log(error);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send("Error Getting SERIES !");    }
}

const getSeasons = async(req,res)=>{
    try{
        const {seriesTitle} = req.body;
        const seasons = await SEASON.find({seriesTitle: seriesTitle});
        res.status(StatusCodes.OK).json({ seasons: seasons});
    }catch(error){
        console.log(error);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send("Error Getting SEASONS!");    }
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
    

        const updated = await SERIES.findOneAndUpdate({_id: id},req.body,{new:true});

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
        const {seriesTitle,seasonNumber} = req.params;

        if (!seriesTitle || !seasonNumber) {
            return res.status(StatusCodes.FORBIDDEN).send('Series title and season numbere number must be defined in the URL parameters');
        }
        //check if season exists
        const season = await SEASON.findOne({
            seriesTitle: seriesTitle,
            seasonNumber: seasonNumber,
        });

        if(!season){
            return res.status(StatusCodes.NOT_FOUND).send('Season not found');
        }

        // check if user is authorized
    

        const updated = await SEASON.findOneAndUpdate({
            seriesTitle: seriesTitle,
            seasonNumber: seasonNumber,
        },req.body,{new:true});

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
    try{
        const {seriesTitle,seasonNumber,episodeNumber} = req.params;
       
        if (!seriesTitle || !seasonNumber || !episodeNumber) {
            return res.status(StatusCodes.FORBIDDEN).send('Series title, season number, and episode number must be defined in the URL parameters');
        }

        //check if season exists
        const episode = await EPISODE.findOne({
            seriesTitle: seriesTitle,
            seasonNumber: seasonNumber,
            episodeNumber: episodeNumber
        });

        if(!episode){
            return res.status(StatusCodes.NOT_FOUND).send('episode not found');
        }

        // check if user is authorized
    

        const updated = await EPISODE.findOneAndUpdate(
            {
                seriesTitle: seriesTitle,
                seasonNumber: seasonNumber,
                episodeNumber: episodeNumber
            },
            req.body,
            { new: true } // Return the updated document
        );


        //send response
        if(updated){
            return res.status(StatusCodes.OK).send(`episode Updated: ${updated}`);
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error Updating episode');
        }
    }catch (error){
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error Updated episode');
    }};


// Remove Series Data 
const removeSeries = async(req,res)=>{
    try{
        const {id} = req.params;
        if(!id){
            return res.status(StatusCodes.FORBIDDEN).send('Series ID not Defined');
        }

        //check if movie exists
        const series = await SERIES.findById(id);

        if(!series){
            return res.status(StatusCodes.NOT_FOUND).send('Series not found');
        }

        // First Delete all transcoded series
        const seriesName = series.title.replace(/\s+/g, '_');
        const rootDir = path.resolve(__dirname, '..');
        const transcodedDataDir = path.join(rootDir,'/series',seriesName);
    
        // Check if the directory exists before attempting to remove it
        const directoryExists = await fs_promise.access(transcodedDataDir)
            .then(() => true)
            .catch(() => false);

        if (directoryExists) {
            // Delete transcoded series directory
            await fs_promise.rm(transcodedDataDir, { recursive: true });
        }

        // delete data in db
        const deleted = await SERIES.findOneAndDelete({_id: id});

        if(deleted){
              //delete associated seasons and episodes
              const deleteSeasons = await SEASON.deleteMany({seriesTitle:deleted.title})
              const deleteEpisodes = await EPISODE.deleteMany({seriesTitle:deleted.title});
          
              //send response
            return res.status(StatusCodes.OK).send(`SERIES Deleted: ${deleted}`);
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error Deleting Series');
        }
    }catch (error){
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error Deleting Series');
    }
};

const removeSeason = async(req,res)=>{
    try{
        const {id} = req.params;
        if(!id){
            return res.status(StatusCodes.FORBIDDEN).send('Season ID not Defined');
        }

        //check if movie exists
        const season = await SEASON.findById(id);

        if(!season){
            return res.status(StatusCodes.NOT_FOUND).send('Season not found');
        }

        // First Delete all transcoded movies
        const seriesName = season.seriesTitle.replace(/\s+/g, '_');
        const seasonName = "Season" + season.seasonNumber.toString();
        const rootDir = path.resolve(__dirname, '..');
        const transcodedDataDir = path.join(rootDir,'/series',seriesName,seasonName);

         // Check if the directory exists before attempting to remove it
         const directoryExists = await fs_promise.access(transcodedDataDir)
         .then(() => true)
         .catch(() => false);

     if (directoryExists) {
         // Delete transcoded series directory
         await fs_promise.rm(transcodedDataDir, { recursive: true });
     }

        // delete data in db
        const deleted = await SEASON.findOneAndDelete({_id: id});

        if(deleted){
            //remove associated episodes
            const deleteEpisodes = await EPISODE.deleteMany({seriesTitle:deleted.seriesTitle});

            //send response
            return res.status(StatusCodes.OK).send(`Season Deleted: ${deleted}`);
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error Deleting season');
        }
    }catch (error){
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error Deleting season');
    }
};

const removeEpisode = async(req,res)=>{
    try{
        const {id} = req.params;
        if(!id){
            return res.status(StatusCodes.FORBIDDEN).send('Episode ID not Defined');
        }

        //check if movie exists
        const episode = await EPISODE.findById(id);

        if(!episode){
            return res.status(StatusCodes.NOT_FOUND).send('Episode not found');
        }

        // First Delete all transcoded movies
        const seriesName = episode.seriesTitle.replace(/\s+/g, '_');
        const seasonName = "Season" + episode.seasonNumber.toString();
        const episodeName = "Episode" + episode.episodeNumber.toString();
        const rootDir = path.resolve(__dirname, '..');
        const transcodedDataDir = path.join(rootDir,'/series',seriesName,seasonName,episodeName);

         // Check if the directory exists before attempting to remove it
         const directoryExists = await fs_promise.access(transcodedDataDir)
         .then(() => true)
         .catch(() => false);

     if (directoryExists) {
         // Delete transcoded series directory
         await fs_promise.rm(transcodedDataDir, { recursive: true });
     }

        // delete data in db
        const deleted = await EPISODE.findOneAndDelete({_id: id});

        //send response
        if(deleted){
            return res.status(StatusCodes.OK).send(`Episode Deleted: ${deleted}`);
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error Deleting episode');
        }
    }catch (error){
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error Deleting episode');
    }
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