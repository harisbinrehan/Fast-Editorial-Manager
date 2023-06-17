const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userSchema = mongoose.Schema({ //User
  firstName: {
    type: String,
    required: [true, 'A user must have a name'],
  },
  middleName: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
  lastName: {
    type: String,
    required: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  profilePicture: {
    type: String,
  },
  password: {
    type: String,
    required: [false, 'A user must have a password'],
    minlength: 8,
    select: false,
  },
  age: {
    type: Number,

  },
  country: {
    type: String,
  },
  phone: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  organisation: {
    type: String,
    required: [true, 'A user must have an organisation'],
  },
  degree: {
    type: String,
    required: [true, 'A user must have a degree'],
  },
  position: {
    type: String,
    required: [true, 'A user must have a position'],
  },
  //use author foreign key to link to author schema
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: false,
  },
  // use review foreign key to link to review schema
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reviewer',
    required: false,
  },
  editor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Editor',
    required: false,
  },
  passwordConfirm: {
    type: String,
    required: false,
  },
  passwordResetToken: {
    type: String,
    required: false,
  },
  passwordResetExpires: {
    type: Date,
    required: false,
  },
  passwordchangedate: Date,
});
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) {
    return next();
  } else {
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
  }
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  console.log('Candidate Password:', candidatePassword);
  console.log('User Password:', userPassword);
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changePassword = function (jwtTimestamp) {
  if (this.passwordchangedate) {
    const newn = parseInt(this.passwordchangedate.getTime() / 1000, 10);
    console.log(jwtTimestamp, newn);
    return jwtTimestamp < newn;
  }
  // False means NOT changed
  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
