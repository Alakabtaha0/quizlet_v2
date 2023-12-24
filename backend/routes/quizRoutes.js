const express = require('express');
const quizController = require('./../controllers/quizController');
const authController = require('./../controllers/authController');

// quiz router middleware to make things look more succinct
const quizRouter = express.Router();

// Routes
quizRouter
    .route('/')
    .get(authController.protect, quizController.getAllQuiz)
    .post(authController.protect, quizController.createQuiz);

quizRouter
    .route('/:id')
    .get(authController.protect, quizController.getQuiz)
    .patch(authController.protect, quizController.updateQuiz)
    .delete(authController.protect, quizController.deleteQuiz);



module.exports = quizRouter;
