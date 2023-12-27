const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Your account needs a name'],
		minlength: 2,
		maxlength: 24
	},
	role: {
		type: String,
		enum: {
			values: ['admin', 'user']
		},
		default: 'user'
	},
	email: {
		type: String,
		required: [true, 'Your account needs a email'],
		lowercase: true,
		unique: true
	},
	// Hash the password then pass it into database
	password: {
		type: String,
		minlength: 8,
		select: false
	},
	passwordChangeAt: {
		type: Date,
		default: Date.now()
	},
	createdAt: {
		type: Date,
		default: Date.now()
	},
	verificationCode: Number,
	verified: {
		type: Boolean,
		default: false
	}
});

// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
	// Only run this function if password was actually modified
	if (!this.isModified('password')) return next();

	// Hash the password with cost of 12
	this.password = await bcrypt.hash(this.password, 12);

	// Delete the passwordConfirm field
	this.passwordConfirm = undefined;
	next();
});

// Goal is to return true or false
// Encrypt passwords in here and then use bcrypt to compare
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
	// 1) Encrypt given candidate password
	// const encryptedPassword = await bcrypt.hash(candidatePassword, 12);
	// 2) Compare the two encrypted passwords
	return await bcrypt.compare(candidatePassword, userPassword) ? true : false;
};


userSchema.methods.changedPasswordAfterLogin = async function (JWTTimeStamp) {
	// Check if the time stamp h
	if (this.passwordChangeAt) {
		const changedTimeStamp = parseInt(this.passwordChangeAt.getTime() / 1000, 10);
		return JWTTimeStamp < changedTimeStamp;
	}

	// False means not changed
	return false;
}

const User = model('User', userSchema);

module.exports = User;
