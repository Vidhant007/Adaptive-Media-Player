#!/bin/bash

# Check if a video file is provided as a command line argument
if [ "$#" -eq 0 ]; then
    echo "Usage: $0 <video_file>"
    exit 1
fi

VIDEO="$1"
OUTPUT_DIR="$2"

# Check if the video file exists
if [ ! -f "$VIDEO" ]; then
    echo "Video file not found: $VIDEO"
    exit 1
fi

#create output directory
mkdir $OUTPUT_DIR

# Perform the ffmpeg operations using the provided video file
ffmpeg -i "$VIDEO" -c:v libsvtav1 -b:v 2M -vf "scale=1280:720" -c:a copy ./$OUTPUT_DIR/output_720p_av1.mp4
ffmpeg -i "$VIDEO" -c:v libsvtav1 -b:v 1M -vf "scale=960:540" -c:a copy ./$OUTPUT_DIR/output_540p_av1.mp4
ffmpeg -i "$VIDEO" -c:v libsvtav1 -b:v 500K -vf "scale=640:360" -c:a copy ./$OUTPUT_DIR/output_360p_av1.mp4

