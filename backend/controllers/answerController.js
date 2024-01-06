const Answer = require('./../models/answerModel');
const catchAsync = require('./../utils/catchAsync');
const Busboy = require('busboy');
const { Storage } = require('@google-cloud/storage');

// Send image to the backend -- This works
module.exports.sendImage = catchAsync((req, res, next) => {
    const busboy = Busboy({ headers: req.headers });
    const imageURL = `answer-image/answer-image-${Date.now()}`;
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        const storage = new Storage({ keyFilename: './quizlet-02-213689986844.json' });
        const bucketName = 'quizlet-02.appspot.com';
        const bucket = storage.bucket(bucketName);
        const blob = bucket.file(`${imageURL}`);
        const blobStream = blob.createWriteStream();

        file.pipe(blobStream);

        file.on('end', () => {
            blobStream.end();
        });
    });

    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        if (fieldname === 'text') {
            req.body.text = val;
            req.body.image = `https://storage.googleapis.com/quizlet-02.appspot.com/${imageURL}`;
            next();
        }
    });

    req.pipe(busboy);
});
module.exports.createAnswer = catchAsync(async (req, res, next) => {
    const { text, image, audio } = req.body;
    const newAnswer = await Answer.create({
        text,
        image,
        audio
    }).catch(err => {
        console.log(err);
    });

    return res.status(201).json({
        status: 'success',
        newAnswer,
    });
});
// Create, read, update, delete
module.exports.getAllAnswers = catchAsync(async (req, res, next) => {
    const answers = await Answer.find();

    res.status(200).json({
        status: 'success',
        answers
    });
});

