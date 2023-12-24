// Need to make file better, Instead of throwing error it
// should prompt the user to reenter details (in create function)
// Control what gets sent back
// Form validation

const Quiz = require("../models/quizModel");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");

module.exports.getAllQuiz = catchAsync(async (req, res, next) => {
  // Build Query
  // 1) Filtering
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);

  // 2) Advanced Filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  let query = Quiz.find(JSON.parse(queryStr));

  // 3) Sorting
  if (req.query.sort) {
    query = query.sort(req.query.sort);
  }

  // Execute Query
  const quiz = await query.populate({
    path: "questions",
    populate: {
      path: "answers"
    }
  });

  // Check if no results
  if (quiz.length <= 0) {
    return res.status(404).json({
      status: "Fail",
      message: "Those search results returned nothing, try a broader search",
    });
  }

  // Send response
  res.status(200).json({
    status: "success",
    results: quiz.length,
    quiz,
  });
});

module.exports.getQuiz = catchAsync(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    return res.status(404).json({
      status: "failed",
      message: "quiz not found",
    });
  }
  res.status(200).json({
    status: "success",
    result: quiz,
  });
});

module.exports.createQuiz = catchAsync(async (req, res, next) => {
  // This entire start is in order to get the name of the user to make sure there's a author
  // const token = req.headers.cookies.split('jwt=')[1];
  const token = req.headers.authorization.split("Bearer ")[1];
  // 2) Verification token
  // Try and catch block for response of errors
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    // Break down the error and send a response back that's descriptive
    // To user
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "Failed",
        message: "Please log in again",
      });
      // If someone mutates the signature
    } else {
      return res.status(401).json({
        status: "Failed",
        message: "Invalid signature",
      });
    }
  }

  const author = await User.findById(decoded.id);
  const quiz = await Quiz.create({ ...req.body, author: author.name });

  res.status(201).json({
    status: "Success",
    message: "Added data to mongoDB",
    data: {
      quiz,
    },
  });
});

module.exports.updateQuiz = catchAsync(async (req, res, next) => {
  const quiz = await Quiz.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!quiz) {
    return res.status(404).json({
      status: "fail",
      message: "No quiz found with that ID",
    });
  }

  res.status(202).json({
    status: "success",
    message: "Quiz has been updated successfully",
    quiz,
  });
});

module.exports.deleteQuiz = catchAsync(async (req, res, next) => {
  const quiz = await Quiz.findByIdAndDelete(req.params.id);

  if (!quiz) {
    return res.status(404).json({
      status: "fail",
      message: "This quiz doesn't exist",
    });
  }

  res.status(201).json({
    status: "success",
    message: "successfully deleted this quiz",
  });
});
