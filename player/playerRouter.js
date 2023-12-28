const express = require('express');
const PLAYER = express.Router();

const {VIDEO_360p,VIDEO_540p,VIDEO_720p} = require('./videoPlayer');

// ROUTES FOR DIFFERENT VIDEO QUALITIES
PLAYER.get('/360p',VIDEO_360p);
PLAYER.get('/540p',VIDEO_540p);
PLAYER.get('/720p',VIDEO_720p);


module.exports = {
    PLAYER: PLAYER,
}