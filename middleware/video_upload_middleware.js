const multer = require("multer");

const { BadRequestError } = require("../errors");


const videoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/videos");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const videoUpload = multer({
    storage: videoStorage,
    limits: {
        fileSize: 1024 * 1024 * 1024 * 5, // max video upload size - 5gb
    },
    fileFilter: function (req, file, cb) {
        if (
            file.mimetype === "video/mp4" ||
            file.mimetype === "video/quicktime" ||
            file.mimetype === "video/x-msvideo" ||
            file.mimetype === "YOUR_VIDEO_MIME_TYPE"
        ) {
            cb(null, true);
        } else {
            cb(new BadRequestError("Only specific video formats are allowed"), false);
        }
    },
});

const videoUploadMiddleware = (req, res, next) => {
    videoUpload.single("video")(req, res, function (err) {
        if (!req.file) {
            return next(new BadRequestError("Please upload a valid video file"));
        }
        next();
    });
};

module.exports = {
    VIDEOUPLOADMIDDLEWARE:videoUploadMiddleware
};
