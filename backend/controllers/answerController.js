const Answer = require('./../models/answerModel');
const catchAsync = require('./../utils/catchAsync');

// Create, read, update, delete

module.exports.getAllAnswers = catchAsync(async (req, res, next) => {
    const answers = await Answer.find();

    res.status(200).json({
        status: 'success',
        answers
    });
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

    res.status(201).json({
        status: 'success',
        newAnswer,
    });
});