const mongoose = require("mongoose");
const slugify = require("slugify");


const QuestionModel = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A quiz must have a name"],
    unique: true,
    trim: true,
    minlength: [5, "Must be longer than 5 characters"],
  },
  slug: {
    type: String,
    default: function () {
      return slugify(this.name);
    },
  },
  answers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
    },
  ],
});

const Question = new mongoose.model('Question', QuestionModel);

module.exports = Question;