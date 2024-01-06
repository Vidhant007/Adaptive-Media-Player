require('dotenv').config();

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors');

app.use(cors());

app.use(express.json());
app.use(express.static("./public/uploads"));

// ROUTERS
const {USERROUTER} = require('./routes/userRouter');
const {SUBSCRIPTIONSROUTER} = require('./routes/subscriptionRoute');
const {PROFILESROUTER} = require('./routes/profileRouter');
const {MOVIESROUTER} = require('./routes/moviesRouter');
const { SERIESROUTER } = require('./routes/seriesRouter');
const {PLANSROUTER} = require('./routes/plansRouter');

// VIDEOPLAYER
const { PLAYER } = require('./player/playerRouter');



const { CONNECTDATABSE } = require('./db/connect');



// VIDEO PLAYER
app.use('/player',PLAYER);


//ROUTES
app.use('/api/v1/auth',USERROUTER);
app.use('/api/v1/profile',PROFILESROUTER);
app.use('/api/v1/subscription',SUBSCRIPTIONSROUTER);
app.use('/api/v1/plans',PLANSROUTER);
app.use('/api/v1/movies',MOVIESROUTER);
app.use('/api/v1/series',SERIESROUTER);



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


