const {exec} = require('child_process');
const path = require('path');

const runTranscodingScript = (videoPath, outputDir) =>{
    return new Promise((resolve, reject) =>{
        const scriptPath = path.join(__dirname,'transcode.sh');
        const command = `${scriptPath} "${videoPath}" "${outputDir}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error running transcoding script: ${error.message}`);
                reject(error);
            } else {
                console.log(`Transcoding script output: ${stdout}`);
                resolve();
            }
        });
    
    });
}

module.exports = {
    RUNTRANSCODINGSCRIPT:runTranscodingScript,
}