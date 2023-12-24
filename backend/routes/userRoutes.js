const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const { sign } = require('jsonwebtoken');

// Middleware
const userRouter = express.Router();

userRouter
    .route('/login')
    .post(authController.login);

userRouter
    .route('/')
    .get(userController.getAllUsers);

userRouter
    .route('/:id')
    .get(authController.protect, userController.getUser)
    .patch(authController.protect, userController.updateUser)
    .delete(authController.protect, userController.deleteUser);

// Nested routes
const signupRouter = express.Router({ mergeParams: true });
signupRouter.post('/', authController.signup);
signupRouter.post('/verify-email', authController.verifyEmail);
signupRouter.post('/finish-sign-up', authController.finishSignUp);


userRouter.use('/signup', signupRouter);

module.exports = userRouter;