const express = require('express');
const SERIES = express.Router();

const {ADDEPISODE,ADDSEASON,ADDSERIES  
    ,REMOVEEPISODE,REMOVESERIES,REMOVESEASON,  
    UPDATEEPISODE,UPDATESEASON,UPDATESERIES,
    GETEPISODES,GETSEASONS,GETSERIES} = require('../controllers/webSeriesController');

SERIES.get('/getSeries',GETSERIES);
SERIES.get('/getEpisodes',GETEPISODES);
SERIES.get('/getSeasons',GETSEASONS);

SERIES.post('/addSeries',ADDSERIES);
SERIES.post('/addEpisode',ADDEPISODE);
SERIES.post('/addSeason',ADDSEASON);

SERIES.delete('/deleteSeries/:id',REMOVESERIES);
SERIES.delete('/deleteEpisode/:id',REMOVEEPISODE);
SERIES.delete('/deleteSeason/:id',REMOVESEASON);

SERIES.patch('/updateSeries/:id',UPDATESERIES);
SERIES.patch('/updateSeason/:seriesTitle/:seasonNumber',UPDATESEASON);
SERIES.patch('/updateEpisode/:seriesTitle/:seasonNumber/:episodeNumber',UPDATEEPISODE);

module.exports = {
    SERIESROUTER: SERIES
}
