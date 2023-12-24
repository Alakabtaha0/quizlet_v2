const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const transporter = require("./../utils/sendEmail");

// This function decodes the token and returns the id of the user
// It is a promise object so you need to await it
const decodeToken = async (req) => {
	// Make sure there's a token to begin with
	let token;
	if (req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")) {
		token = req.headers.authorization.split("Bearer ")[1];
	} else {
		console.log("No token");
		// If there's no token return null
		return null;
	}

	// Decode the token and return it
	let decoded;
	try {
		decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	} catch (err) {
		return err;
	}

	return decoded;
};

const createToken = catchAsync((user, statusCode, res, message) => {
	// Create token
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRATION,
	});

	// Send the response
	res.status(statusCode).json({
		status: "success",
		token,
		user,
		message
	});
});


exports.finishSignUp = catchAsync(async (req, res, next) => {
	// 1) Get user
	const token = await decodeToken(req);
	const user = await User.findById(token.id);

	if (!user) {
		return res.status(401).json({
			status: "Failed",
			message: "Invalid token",
		});
	}
	// 2) Upload password to database
	const password = req.body.password;
	let newUser;
	try {
		// The .select is to control what gets sent back, do this for all the functions
		newUser = await User.findByIdAndUpdate(user._id,  {password: password} , { new: true, runValidators: true }).select('-__v -verificationCode -verified -passwordChangeAt -createdAt');
	} catch (err) {
		return res.status(400).json({
			status: 'fail',
			message: 'Please check your password and try again'
		});
	}

	// 3) send response
	return res.status(200).json({
		status: 'success',
		message: 'Password uploaded successfully, your account is completely finished',
		newUser
	})
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
	// 6) Compare entered verification code with the one in the database
	// Need to send JWT token to here so that it can compare the id and get the verification code like that
	// Instead of just comparing the verification code
	// For now this is fine but do this later
	const token = await decodeToken(req);
	const user = await User.findById(token.id);

	if (!user) {
		return res.status(401).json({
			status: "Failed",
			message: "Invalid token",
		});
	}

	// Check if the verification code is correct and if it is then mark the user as verified
	if (user.verificationCode !== req.body.verificationCode) {
		return res.status(401).json({
			status: "Failed",
			message: "Incorrect verification code, please try again",
		});
	} else {
		// Mark user as verified and prompt to enter password
		await User.findByIdAndUpdate(user._id, { verified: true });
		return res.status(200).json({
			status: "Success",
			token: req.headers.authorization.split("Bearer ")[1],
			message:
				"Correct verification code: please continute to /api/v1/users/signup/finish-sign-up",
		});
	}
});

exports.signup = catchAsync(async (req, res, next) => {
	// 1) Get email
	const { name, email } = req.body;
	// 2) Generate random 6-digit verification code
	const verificationCode = Math.floor(100000 + Math.random() * 900000);

	// 3) Create new user
	const newUser = await User.create({ name, email, verificationCode }).catch(
		(err) => {
			return res.status(500).json({
				status: "fail",
				message: `Error creating user: ${err}`,
			});
		}
	);
	// 4) Send email with verification code
	// 5) Send response or error if there is one
	// Check status code to see if user was even created
	if (newUser.statusCode !== 500) {
		// // Create JWT token
		// const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
		// 	expiresIn: process.env.JWT_EXPIRATION,
		// });
		// // END JWT CODE
		const sendEmail = await transporter
			.sendMail({
				from: "Taha Al Akab <alakabtaha@gmail.com>",
				to: email,
				subject: "Verify your email address",
				text: `Your verification code is ${verificationCode}`,
			})
			.catch((err) => {
				console.log(err);
				return res.status(500).json({
					status: "fail",
					message: "`Error sending email: ${err}`",
				});
			});
		return createToken(newUser, 201, res, 'Verification code sent, to continue please send your verification code to /api/v1/users/signup/verify-email');
	}
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	// 1) Check if email and password exist
	if (!email || !password) {
		return next(
			res.status(404).json({
				status: "Fail",
				message: "Please provide a correct email and password",
			})
		);
	}

	// 2) Check if user exists & password is correct
	const user = await User.findOne({
		email: email,
	}).select("+password");

	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(
			res.status(401).json({
				status: "Fail",
				message: "Incorrect email or password",
			})
		);
	}

	// 3) If everythings ok, send token to client along with user data
	createToken(user, 200, res, 'Logged in successfully');
});

// Middleware to protect our routes
exports.protect = catchAsync(async (req, res, next) => {
	// 1) Get token and check if it's there
	// const token = req.headers.cookie.split('jwt=')[1];
	// Use cookies
	// req.headers.authorization.split("Bearer")[1]

	const token = await decodeToken(req);

	// In case there's no cookies/token
	if (!token) {
		return next(
			res.status(401).json({
				status: "Failed",
				message: "You are not logged in. Please log in",
			})
		);
	}

	// Break down the error and send a response back that's descriptive
	// To user
	if (token.name === "TokenExpiredError") {
		return res.status(401).json({
			status: "Failed",
			message: "Session Expired: Please log in again",
		});
	// If someone mutates the signature
	} else if (token.name === "JsonWebTokenError") {
		return res.status(401).json({
			status: "Failed",
			message: "Invalid signature",
		});
	}


	// 3) Check if user still exists
	const freshUser = await User.findById(token.id);
	if (!freshUser) {
		return next(
			res.status(401).json({
				status: "Failed",
				message: "This user no longer exists",
			})
		);
	}
	
	// Grant access to protected route
	req.user = freshUser;
	next();
});

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		// We can use req.user as it's after the previous middleware where this was initialized
		if (!roles.includes(req.user.role)) {
			return next(
				res.status(403).json({
					status: "Failed",
					message: "You aren't allowed to use this page",
				})
			);
		}

		next();
	};
};
