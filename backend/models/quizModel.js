const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const slugify = require('slugify');


// Create admin front end
// fully control quizes - create questions, create quizzes, list all users in another section
// start off basic, get it working then add features

// Answer Table
// -- create a answer ( text, picture, audio )
// id=1, value='messi', imgSrc, ≠
// id=4, value='ronaldo'
// id=6, value='pop'
// id=9, value='wateva'
// id=2, value='https://www.something.com/pic12


const quizModel = new Schema({
    name: {
        type: String,
        required: [true, 'A quiz must have a name'],
        unique: true,
        trim: true,
        minlength: [5, 'Must be longer than 5 characters']
    },
    slug: {
        type: String,
        default: function () {
            return slugify(this.name);
        }
    },
    author: String,
    description: {
        type: String,
        required: [true, 'Must contain a description']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    numberOfQuestions: {
        type: Number,
        default: function () {
            return Object.keys(this.questions).length;
        }
    },
    questions: [{
        type: mongoose.Types.ObjectId,
        ref: 'Question'
    }]
    // category: {
    //     type: String,
    //     required: [true, 'select a category'],
    //     enum: { 
    //         values: ['Countries', 'Food', 'Tech'],
    //         message: 'Categories are: Countries, Food, Tech'
    //     }
    // }
});


const Quiz = model('Quiz', quizModel);

module.exports = Quiz