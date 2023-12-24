const mongoose = require('mongoose');


// -- create a question ( question text, answers[] )
// Create the answer table (schema, routes, etc.)
// for the answer table store text, image, audio
// Create the question table (schema, routes, etc.)
// for the question table it should contain the question text and 4 answers
// the answers should be an array of answers that points to the id's of answers
// so it should be foreign keys

const AnswerSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Must contain text']
    },
    image: {
        type: String
    },
    audio: {
        type: String,
    }
});


const Answer = mongoose.model('Answer', AnswerSchema);

module.exports = Answer;