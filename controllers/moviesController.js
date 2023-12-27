const path = require('path');
const fs = require('fs'); 
const multer = require('multer');
const {StatusCodes} = require('http-status-codes');

const MOVIE = require('../models/movieModel');
const {RUNTRANSCODINGSCRIPT} = require('../transcoder/transcoder');


// storage
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
    storage: Storage
}).fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]);


//get all movies
const getMovies = async(req,res)=>{
    res.send("Get Movies");
}

//this controller will run the transcode.sh script after videoUpload is completed
const addMovie = async (req, res) => {
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

        const newMovie = new MOVIE({
            title: req.body.title,
            description: req.body.description,
            genre: req.body.genre,
            rating: req.body.rating,
            images: images,
            videoPath: videoPath,
        });

        try {
            await newMovie.save();

            if(videoPath){
                await RUNTRANSCODINGSCRIPT(videoPath, 'transcoded_videos');
                console.log('trancoding completed successfully')
            }
            res.status(StatusCodes.CREATED).json('Successfully uploaded');
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error saving movie details' });
        }
    });
};



//runs with the player middleware
const getMovieDetails = async(req,res)=>{
    res.send("Get Movies Details");
};

const editMovieDetails = async(req,res)=>{
    res.send("Edit Movies Details");
};

const removeMovie = async(req,res)=>{
    res.send("Remove Movie");
};



module.exports = {
    GETMOVIES:getMovies,
    GETMOVIEDETAILS:getMovieDetails,
    EDITMOVIEDETAILS:editMovieDetails,
    REMOVEMOVIE:removeMovie,
    ADDMOVIE:addMovie,
}
