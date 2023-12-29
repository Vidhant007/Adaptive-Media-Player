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

SERIES.delete('/deleteSeries',REMOVESERIES);
SERIES.delete('/deleteEpisode',REMOVEEPISODE);
SERIES.delete('/deleteSeason',REMOVESEASON);

SERIES.patch('/updateSeries',UPDATESERIES);
SERIES.patch('/updateSeason',UPDATESEASON);
SERIES.patch('/updateEpisode',UPDATEEPISODE);

module.exports = {
    SERIESROUTER: SERIES
}
