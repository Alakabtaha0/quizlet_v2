const express = require('express');
const resultsController = require('../controllers/resultsController')

const resultsRouter = express.Router();

resultsRouter
    .route('/')
    .get(resultsController.getAllResults)
    .post(resultsController.createResult);

module.exports = resultsRouter;