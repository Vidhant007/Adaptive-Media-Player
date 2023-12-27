const express = require('express');
const MOVIES = express.Router();

const {GETMOVIES,GETMOVIEDETAILS,REMOVEMOVIE,EDITMOVIEDETAILS,ADDMOVIE} = require('../controllers/moviesController');

const {IMAGEUPLOADMIDDLEWARE} = require('../middleware/image_upload_middleware');
const {VIDEOUPLOADMIDDLEWARE} = require('../middleware/video_upload_middleware');


MOVIES.get('/getmovies',GETMOVIES);
MOVIES.get('/getmovie/:id',GETMOVIEDETAILS);
MOVIES.post('/addmovie',ADDMOVIE);
MOVIES.patch('/editmovie/:id',EDITMOVIEDETAILS);
MOVIES.delete('/removemovie/:id',REMOVEMOVIE);

module.exports = {
    MOVIESROUTER : MOVIES,
}