const Results = require('../models/resultsModel');
const User = require('../models/userModel');
const Quiz = require('../models/quizModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');

//CRUD
// No need to update a result

// Read all results
module.exports.getAllResults = catchAsync(async (req, res, next) => {
    const results = await Results.find();

    res.status(201).json({
        status: 'success',
        results
    })
});

// Create a result
module.exports.createResult = catchAsync(async (req, res, next) => {
    // Verify user is logged in (can create middleware - do later)
    const token = req.headers.cookie.split('jwt=')[1];

    let decoded;
    try {
        decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'failed',
                message: 'Please log in again'
            });
        } else {
            return res.status(401).json({
                status: 'failed',
                message: 'Invalid Signature'
            });
        }
    };

    // Build query and make sure no malicious code
    const {quiz, results, score} = req.body;
    const user = decoded.id;

    // Send query
    const result = await Results.create({quiz, user, results, score});
    res.status(201).json({
        status: 'Success',
        message: 'Added data to mongoDB',
        result
    })
});
