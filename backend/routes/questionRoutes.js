const express = require('express');
const authController = require('./../controllers/authController');
const questionController = require('./../controllers/questionController');

const questionRouter = express.Router();

questionRouter
    .route('/')
    .get(authController.protect, questionController.getAllQuestions)
    .post(authController.protect, questionController.createQuestion);

questionRouter
    .route('/:id')
    .get(authController.protect, questionController.getOneQuestion);

module.exports = questionRouter;