const express = require('express');
const answerController = require('./../controllers/answerController');
const authController = require('./../controllers/authController');

const answerRouter = express.Router();

answerRouter
    .route('/')
    .get(authController.protect, answerController.getAllAnswers)
    .post(authController.protect, answerController.createAnswer);

module.exports = answerRouter;