const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');


// ROUTERS
const {USERROUTER} = require('./routes/userRoute');
const {SUBSCRIPTIONSROUTER} = require('./routes/subscriptionRoute');
const {PROFILESROUTER} = require('./routes/profileRouter');


const videoDir = path.join(__dirname, 'video2'); // Set the video directory path

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/360p', function (req, res) {
  streamVideo(path.join(videoDir, 'output_360p_av1.mp4'), req, res);
});

app.get('/540p', function (req, res) {
  streamVideo(path.join(videoDir, 'output_540p_av1.mp4'), req, res);
});

app.get('/720p', function (req, res) {
  streamVideo(path.join(videoDir, 'output_720p_av1.mp4'), req, res);
});

function streamVideo(videoFileName, req,res) {
 
 // Ensuring there is range given for video
  const range = req.headers.range;
  if(!range){
    res.status(400).send("Requires Range header");
  }

  //get video Stats
  const videoPath = videoFileName;
  const videoSize = fs.statSync(videoPath).size;

  //Parse Range
  const CHUNK_SIZE=10 ** 6; //1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);


  // Calculate content length
  const contentLength = end - start + 1;

  //Create headers
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };
  //HTTP Status 206 for Partial Content
  res.writeHead(206, headers);
  //create video read Stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath,{start,end});
  //stream the video chunk to client
  videoStream.pipe(res);
}

//ROUTES
app.use('/api/v1/auth',USERROUTER);
app.use('/api/v1/profile',PROFILESROUTER);
app.use('/api/v1/subscription',SUBSCRIPTIONSROUTER);

app.listen(8000, function () {
  console.log('Listening on port 8000!');
});
