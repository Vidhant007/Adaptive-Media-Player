# Adaptive-Media-Player
### 1. creating a Sever-Side Adaptive videoPlayer
### 2. Video Transcoding (AV1-CODEC)
### 3. Microservice based video streaming architecture 


### NOTE : to Run transcoder, ffmpeg needs to be installed and configured manually with libsvtav1 encoder wrapper.
# How install ffmpeg with libsvt1
###### 1. Install Build Dependencies
```
sudo apt-get update
sudo apt-get install -y build-essential git yasm
```
###### 2. Download Ffmpeg 6.1 (zip or tar file) (usually any version above 5 works) 
###### 3. Configure and Compile
```
cd FFmpeg
./configure --enable-libsvtav1
make
```
###### 4. Install
```
sudo make install
```
###### 5. Verify Installation
```
ffmpeg -version
```

