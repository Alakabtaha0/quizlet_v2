const mongoose = require('mongoose');
const Question = require('./../models/questionModel');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const { request } = require('../app');

// CRUD
module.exports.getAllQuestions = catchAsync(async (req, res, next) => {
    const questions = await Question.find().populate('answers');

    res.status(200).json({
        status: 'success',
        questions
    });
});

module.exports.getOneQuestion = catchAsync(async (req, res, next) => {
    const quiz = await Question.findById(req.params.id).populate('answers');

    if (!quiz) {
        return res.status(404).json({
            status: 'failed',
            message: 'quiz not found'
        });
    }

    res.status(200).json({
        status: 'success',
        quiz
    });
});

module.exports.createQuestion = catchAsync(async (req, res, next) => {
    const { name, answers } = req.body;
    const newQuestion = await Question.create({
        name,
        answers
    }).catch(err => {
        console.log(err);
    });

    res.status(201).json({
        status: 'success',
        newQuestion,
    });
});