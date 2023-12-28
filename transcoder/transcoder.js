const {exec} = require('child_process');
const path = require('path');

const runTranscodingScript = (videoPath, outputDir) =>{
    return new Promise((resolve, reject) =>{
        const scriptPath = path.join(__dirname,'transcode.sh');
        const command = `${scriptPath} "${videoPath}" "${outputDir}"`;
        
        const process = exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error running transcoding script: ${error.message}`);
                reject(error);
            } else {
                console.log(`Transcoding script output: ${stdout}`);
                resolve(stdout);
            }
        });

        // Capture and log stdout
        process.stdout.on('data', (data) => {
            console.log(`Transcoding script stdout: ${data}`);
        });

        // Capture and log stderr
        process.stderr.on('data', (data) => {
            console.error(`Transcoding script stderr: ${data}`);
        });
    });
};


module.exports = {
    RUNTRANSCODINGSCRIPT:runTranscodingScript,
}