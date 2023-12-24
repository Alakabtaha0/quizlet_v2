const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const AnswerSchema = new Schema({
    answer: {
        type: String,
        required: true
    },
    correct: {
        type: Boolean,
        required: true
    }
});

const QuestionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    answer: [AnswerSchema]
});

const ResultsSchema = new Schema({
    quiz: [{
        type: mongoose.Schema.Types.Object,
        ref: 'Quiz'
    }],
    user: [{
        type: mongoose.Schema.Types.Object,
        ref: 'User'
    }],
    results: [QuestionSchema],
    score: Number
});


const Results = model('Results', ResultsSchema);

module.exports = Results;
