const User = require('../model/userModel');
const AppError = require('../utils/appError');
const Author = require('../model/authorModel');
const Reviewer = require('../model/reviewerModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const signintoken = (id) => {
  return jwt.sign({ id: id }, 'secrett', { expiresIn: '90d' });
};

exports.signup = async (req, res, next) => {
  try {
    const data = req.body;
    console.log(data);
    if (!data.firstName || !data.email || !data.password || !data.passwordConfirm || !data.lastName) {
      return next(new AppError('Please provide name, email and password!', 400));
    }
    const user = await User.findOne({ email: data.email });
    if (user) {
      return next(new AppError('User already exists!', 400));
    }
    const newUser = await User.create(data);
    const token = signintoken(newUser._id);
    const author = await Author.create({ countOfAcceptedPapers: 0, countOfRejectedPapers: 0, countOfSubmittedPapers: 0, user: newUser._id });
    let reviewer = null;
    if (data.isReviewer) {
      reviewer = new Reviewer({ minorFields: data.minorFields, majorField: data.majorField, user: newUser._id });
      await reviewer.save();
    }

    newUser.author = author._id;
    if (reviewer) {
      newUser.reviewer = reviewer._id;
    }
    await newUser.save();

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
        token: token,
      },
    });

  } catch (err) {
    console.log(err);
    next(err);
  }
}


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('author').populate('reviewer').populate('editor').select('+password');;

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const correct = await user.correctPassword(password, user.password);
    if (!correct) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    const token = signintoken(user._id);

    const responseData = {
      user: {
        _id: user._id,
        email: user.email,
        profilePicture: user.profilePicture,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    };

    if (user.author) {
      responseData.user.authorId = user.author._id;
    }

    if (user.reviewer) {
      responseData.user.reviewerId = user.reviewer._id;
    }

    if (user.editor) {
      responseData.user.editorId = user.editor._id;
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.forgotPassword = async (req, res, next) => {
  let user; // Define the user variable here

  try {
    // Get user based on POSTed email
    user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (!user) {
      return next(new AppError('There is no user with that email address.', 404));
    }

    // Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send reset token to user's email
    const resetURL = `http://localhost:3000/Password-reset/${resetToken}`;
    const emailContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <img src="cid:unique@nodemailer.com" alt="Your Project Logo" style="max-width: 150px; display: block; margin: 20px auto;" />
    <h1 style="font-size: 24px; text-align: center;">Password Reset Request</h1>
    <p style="font-size: 18px; line-height: 1.6;">
      Dear User,
    </p>
    <p style="font-size: 18px; line-height: 1.6;">
      We received a request to reset your password. To reset your password, please click the button below:
    </p>
    <div style="text-align: center;">
      <a href="${resetURL}" style="background-color: #3097d1; color: #ffffff; font-size: 18px; text-decoration: none; padding: 12px 24px; border-radius: 4px; display: inline-block;">Reset Your Password</a>
    </div>
    <p style="font-size: 18px; line-height: 1.6;">
      If you did not request a password reset, please ignore this email. Your password will remain unchanged.
    </p>
    <p style="font-size: 18px; line-height: 1.6;">
      Best regards,
    </p>
    <p style="font-size: 18px; line-height: 1.6;">
      FAST EDITORIAL MANAGER
    </p>
  </div>
`;

    await sendEmail(
      user.email,
      'Your password reset token (valid for 10 minutes)',
      emailContent,
    );

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    if (user) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
    }
    console.error(err);
    return next(new AppError('There was an error sending the email. Try again later!', 500));
  }
};


exports.resetPassword = async (req, res, next) => {
  try {
    // Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // If the token has not expired, and there is a user, set the new password
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Update changedPasswordAt property for the user
    // This should be done in the userModel as a pre save middleware

    // Log the user in, send JWT
    const token = signintoken(user._id);
    res.status(200).json({
      status: 'success',
      message: 'Password has been updated',
      token,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
