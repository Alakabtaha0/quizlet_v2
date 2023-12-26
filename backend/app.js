const express = require('express');
const app = express();
const quizRouter = require('./routes/quizRoutes');
const userRouter = require('./routes/userRoutes');
const resultsRouter = require('./routes/resultsRoutes');
const answerRouter = require('./routes/answerRoutes');
const questionRouter = require('./routes/questionRoutes');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cors = require('cors');


// Render the react page - Serving static files
app.use(express.static('public/build'));

// Global Middle wares
app.use(cors());
// Set security HTTP Headers
app.use(helmet());

// Rate limiter to avoid getting Ddos'd
const limiter = rateLimit({
    max: 10000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour'
});

// only limit the /api route
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization
// NoSQL query Injection
app.use(mongoSanitize());

// Cross site scripting (XSS)
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
    whitelist: [ 'numberOfQuestions', 'category']
}));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// Routes
app.use('/api/v1/quiz', quizRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/results', resultsRouter);
app.use('/api/v1/answers', answerRouter);
app.use('/api/v1/questions', questionRouter);

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to the quiz app'
    })
})
app.get('/*', (req, res) => {
    // Serve the static files from the React app
    res.sendFile(path.resolve(__dirname, 'public', 'build', 'index.html'));
});

module.exports = app;