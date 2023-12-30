const path = require('path');
const fs = require('fs'); 
const fs_promise = require('fs').promises; 
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
    const movies = await MOVIE.find();
    res.status(StatusCodes.OK).json(movies);
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
        
        const movieName = newMovie.title.replace(/\s+/g, '_');
        const outputDir = path.join('movies', movieName);
        
        // Check if the directory exists; create it if not
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        try {
            await newMovie.save();

            if(videoPath){
                await RUNTRANSCODINGSCRIPT(videoPath, outputDir);

                // Update the videoPath in db with trancoded video path
                newMovie.videoPath = outputDir;
                await newMovie.save();

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
    try{
        const {id} = req.params;
        if(!id){
            return res.status(StatusCodes.FORBIDDEN).send('Movie ID not Defined');
        }

        //check if movie exists
        const movie = await MOVIE.findById(id);

        if(!movie){
            return res.status(StatusCodes.NOT_FOUND).send('Movie not found');
        }

        // check if user is authorized
    

        const updated = await MOVIE.findOneAndUpdate({_id: id},req.body,{new:true});

        //send response
        if(updated){
            return res.status(StatusCodes.OK).send(`Movie Updated: ${updated}`);
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error Updating Movie');
        }
    }catch (error){
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error Updated Movie');
    }
};



const removeMovie = async(req,res)=>{
    try{
        const {id} = req.params;
        if(!id){
            return res.status(StatusCodes.FORBIDDEN).send('Movie ID not Defined');
        }

        //check if movie exists
        const movie = await MOVIE.findById(id);

        if(!movie){
            return res.status(StatusCodes.NOT_FOUND).send('Movie not found');
        }

        // First Delete all transcoded movies
        const rootDir = path.resolve(__dirname, '..');
        const transcodedDataDir = path.join(rootDir,movie.videoPath);
        await fs_promise.rm(transcodedDataDir,{recursive: true});
    
        // delete data in db
        const deleted = await MOVIE.findOneAndDelete({_id: id});

        //send response
        if(deleted){
            return res.status(StatusCodes.OK).send(`Movie Deleted: ${deleted}`);
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error Deleting Movie');
        }
    }catch (error){
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error Deleting Movie');
    }
};



module.exports = {
    GETMOVIES:getMovies,
    GETMOVIEDETAILS:getMovieDetails,
    EDITMOVIEDETAILS:editMovieDetails,
    REMOVEMOVIE:removeMovie,
    ADDMOVIE:addMovie,
}