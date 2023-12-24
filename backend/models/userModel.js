const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const validator = require('validator');

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
        values: [ 'admin', 'user']
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


// Goal is to return true or false
// Encrypt passwords in here and then use bcrypt to compare
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await candidatePassword === userPassword ? true : false;
};

userSchema.methods.changedPasswordAfterLogin = async function(JWTTimeStamp) {
    // Check if the time stamp h
    if (this.passwordChangeAt) {
        const changedTimeStamp = parseInt(this.passwordChangeAt.getTime() /1000, 10);
        return JWTTimeStamp < changedTimeStamp;
    }

    // False means not changed
    return false;
}

const User = model('User', userSchema);

module.exports = User;
