require('dotenv').config();

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.json());
app.use(express.static("./public/uploads"));

// ROUTERS
const {USERROUTER} = require('./routes/userRoute');
const {SUBSCRIPTIONSROUTER} = require('./routes/subscriptionRoute');
const {PROFILESROUTER} = require('./routes/profileRouter');
const {MOVIESROUTER} = require('./routes/moviesRouter');

//IMPORT VIDEOPLAYER
const {VIDEO_360p,VIDEO_540p,VIDEO_720p} = require('./player/videoPlayer');

const { CONNECTDATABSE } = require('./db/connect');



app.post('/360p',VIDEO_360p);
app.post('/540p',VIDEO_540p);
app.post('/720p',VIDEO_720p);




//ROUTES
app.use('/api/v1/auth',USERROUTER);
app.use('/api/v1/profile',PROFILESROUTER);
app.use('/api/v1/subscription',SUBSCRIPTIONSROUTER);
app.use('/api/v1/movies',MOVIESROUTER);


const PORT = process.env.PORT ;

const start = async()=>{
  try{
    
    CONNECTDATABSE();
    app.listen(PORT,()=>{
      console.log(`Server is running on port ${PORT}`);
    })

  }catch(error){
    console.log(error);
  }
}

start();


