const path = require('path');
const fs = require('fs');

// experimemntal find a way to send it dynamically
const videoDir = path.resolve(__dirname, '..', 'videos'); // Go up one directory and then into 'video2'


const video_360p = async(req,res) =>{
  const {videoDir} = req.body;
  streamVideo(path.join(videoDir, 'output_360p_av1.mp4'), req, res);
}

const video_540p = async(req,res) =>{
  const {videoDir} = req.body;
  streamVideo(path.join(videoDir, 'output_540p_av1.mp4'), req, res);
}

const video_720p = async(req,res) =>{
  const {videoDir} = req.body;
  streamVideo(path.join(videoDir, 'output_720p_av1.mp4'), req, res);
}

function streamVideo(videoFileName, req,res) {
 
    // Ensuring there is range given for video
     const range = req.headers.range;const videoDir = path.join(__dirname, 'video2'); // Set the video directory path

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

  module.exports = {
    VIDEO_360p : video_360p,
    VIDEO_540p:video_540p,
    VIDEO_720p:video_720p,
  }
