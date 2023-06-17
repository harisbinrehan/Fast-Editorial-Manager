const Manuscript = require("../model/manuscriptModel");
const Author = require("../model/authorModel");
const Recommend = require("../model/recommend");
const User = require("../model/userModel");
const AppError = require("../utils/appError");
const fs = require("fs");
const Editor = require("../model/editorModel");
const Reviewer = require("../model/reviewerModel");
const Review = require("../model/reviewModel");
const Notification = require('../model/notificationsModel');
const myEmitter = require('../utils/eventEmmiter');
const path = require("path");
const multer = require("multer");
const sendEmail = require("../utils/sendEmail")
const crypto = require('crypto');

const createNotification = async (message, userId) => {
  const notification = new Notification({ message: message, recipient: userId, read: false });
  await notification.save();
  myEmitter.emit('notification', notification, userId.toString());

};
const profilePictureDir = path.join(__dirname, "..", "public", "profile-pictures");
if (!fs.existsSync(profilePictureDir)) {
  fs.mkdirSync(profilePictureDir, { recursive: true });
}
console.log(profilePictureDir)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, profilePictureDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
exports.upload = upload;

exports.addEditor = async (req, res) => {
  try {
    // Extract fields from the request body
    const {
      firstName,
      lastName,
      email,
      password,
      age,
      country,
      state,
      city,
      organisation,
      degree,
      position,
      passwordConfirm,
      field, // Add field for the editor model
    } = req.body;

    // Create a new User instance
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      age,
      country,
      state,
      city,
      organisation,
      degree,
      position,
      passwordConfirm,
    });

    // Save the user to the database
    await user.save();

    // Create a new Editor instance
    const editor = new Editor({
      // Add any additional fields for the editor model as needed
      user: user._id,
      field, // Set the field property for the editor model
    });

    // Save the editor to the database
    await editor.save();

    // Update the user's editor field and save the user
    user.editor = editor._id;
    await user.save();

    // Return a successful response
    res.status(201).json({
      message: 'Editor created successfully.',
      data: {
        userId: user._id,
        editorId: editor._id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create editor.', error: error.message });
  }
};

exports.assignReviewer = async (req, res) => {
  try {
    const { manuscriptId, reviewerEmail, editorId, reviewerFirstName, reviewerLastName, organisation, degree, position, majorField, minorFields } = req.body;

    // Check if the manuscript exists and the editor has the authority
    const manuscript = await Manuscript.findById(manuscriptId).populate('editor');
    if (!manuscript) {
      return res.status(404).json({ message: 'Manuscript not found.' });
    }

    if (!manuscript.editor || manuscript.editor._id.toString() !== editorId.toString()) {
      return res.status(403).json({ message: 'You do not have the authority to assign reviewers to this manuscript.' });
    }

    // Check if the reviewer exists by their email
    let user = await User.findOne({ email: reviewerEmail }).populate('reviewer');
    let isNewReviewer = false;

    // Create a new User and Reviewer if they do not exist in the system
    if (!user || !user.reviewer) {
      isNewReviewer = true;

      // Create a new user with no password
      user = new User({
        firstName: reviewerFirstName,
        lastName: reviewerLastName,
        email: reviewerEmail,
        organisation: organisation,
        degree: degree,
        position: position,
      });
      var resetToken = user.createPasswordResetToken();
      await user.save({ validateBeforeSave: false });

      // Create a new reviewer tied to the user
      const reviewer = new Reviewer({
        user: user._id,
        majorField: majorField,
        minorFields: minorFields,
      });
      await reviewer.save();

      user.reviewer = reviewer._id;
      await user.save();
    }

    let reviewer = user.reviewer;

    // Create a new Review instance with the given manuscriptId, reviewerId, and editorId
    const review = new Review({
      editor: editorId,
      reviewer: reviewer._id,
      manuscript: manuscriptId,
      reviewstatus: 'onreq',
    });

    await review.save();

    manuscript.reviewIds.push(review._id);

    // Update the manuscript's status to 'reviewerAssigned'
    manuscript.status = 'reviewerAssigned';
    await manuscript.save();

    const resetPasswordUrl = isNewReviewer ? `http://localhost:3000/Password-reset/${resetToken}` : '';
    const acceptUrl = `http://localhost:3000/Reviewer/NewInvitations`;
    const rejectUrl = `http://localhost:3000/Reviewer/NewInvitations`;

    const emailContent = `
    <div style="text-align: center;">
      <img src="cid:unique@nodemailer.com" alt="Your Project Logo" style="max-width: 150px; display: block; margin: 20px auto;" />
    <h1 style="font-size: 24px; color: #444;">You've been invited to review a manuscript!</h1>
      <p style="font-size: 18px; color: #444;">Dear ${user.firstName} ${user.lastName},</p>
      <p style="font-size: 16px; color: #444;">You've been selected as a reviewer for a manuscript. Please click on the appropriate link below to accept or reject the request.</p>
      ${isNewReviewer ? `<p style="font-size: 16px; color: #444;">Since you are new to our platform, please first <a href="${resetPasswordUrl}">create your password</a>.</p>` : ''}
   
      <a href="${acceptUrl}" style="background-color: #3097d1; color: #ffffff; font-size: 18px; text-decoration: none; padding: 12px 24px; margin-bottom:5px; border-radius: 4px; display: inline-block;">Accept Request</a>
<br/>
      <a href="${rejectUrl}" style="background-color: #3097d1; color: #ffffff; font-size: 18px; text-decoration: none; padding: 12px 24px; border-radius: 4px; display: inline-block;">Reject Request</a>
    </div>
    `;
    const notificationContent = `You have been assigned to review manuscript having title ${manuscript.title}. Please check your dashboard for more details and to accept or reject the request.`;
    console.log(`Notification to reviewer ${user._id}: ${notificationContent}`);
    await createNotification(notificationContent, user._id);
    // Email details

    await sendEmail(reviewerEmail, 'New Manuscript Review Request', emailContent);
    // Send the email


    res.status(200).json({ message: 'Reviewer assigned and notified.', data: { reviewId: review._id } });
  } catch (error) {
    console.error(error);
    if (user) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
    }
    res.status(500).json({ message: 'Failed to assign reviewer.', error: error.message });
  }
};

exports.getNewSubmissions = async (req, res, next) => {
  try {
    const { editorId } = req.params;

    const submittedManuscripts = await Manuscript.find({
      status: 'submitted',
      editor: editorId,
    })
      .populate({
        path: 'author',
        select: 'user', // Select the user field in the Author model
        populate: {
          path: 'user',
          select: 'firstName middleName lastName', // Select the required fields in the User model
        },
      });

    res.status(200).json({
      status: 'success',
      data: {
        manuscripts: submittedManuscripts,
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.getPendingForReview = async (req, res, next) => {
  try {
    const { editorId } = req.params;

    const submittedManuscripts = await Manuscript.find({
      status: 'pendingReview',
      editor: editorId,
    })
      .populate({
        path: 'author',
        select: 'user', // Select the user field in the Author model
        populate: {
          path: 'user',
          select: 'firstName middleName lastName', // Select the required fields in the User model
        },
      });

    res.status(200).json({
      status: 'success',
      data: {
        manuscripts: submittedManuscripts,
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.rejectByEditor = async (req, res) => {
  try {
    const manuscriptId = req.params.manuscriptId; // Assuming the manuscript ID is passed as a URL parameter
    const editorId = req.body.editorId; // Assuming you have a user object in the request
    const commentsFromEditor = req.body.commentsFromEditor;

    // Fetch the manuscript and update its status
    const manuscript = await Manuscript.findById(manuscriptId).populate({
      path: 'author',
      select: 'user', // Assuming the Author schema has a 'user' field referencing the user ID
    });
    if (!manuscript) {
      return res.status(404).json({ error: 'Manuscript not found' });
    }
    manuscript.status = 'rejected';
    manuscript.commentsFromEditor = commentsFromEditor;
    await manuscript.save();

    // Create a new notification for the author
    notification = `Your Manuscript ${manuscript.title} has been rejected by the editor`
    // Emit the notification event to the user using Socket.IO
    await createNotification(notification, manuscript.author.user);
    res.status(200).json({ message: 'Manuscript rejected and author notified' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.acceptByEditor = async (req, res) => {
  try {
    const manuscriptId = req.params.manuscriptId;

    // Fetch the manuscript and update its status
    const manuscript = await Manuscript.findById(manuscriptId);
    if (!manuscript) {
      return res.status(404).json({ error: 'Manuscript not found' });
    }
    manuscript.status = 'pendingReview';
    await manuscript.save();

    res.status(200).json({ message: 'Manuscript accepted and status updated to pendingReview' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.recommendReviewers = async (req, res) => {
  try {
    const manuscriptId = req.params.manuscriptId;
    const manuscript = await Manuscript.findById(manuscriptId);
    console.log("This Is Manuscript ID", manuscriptId)
    console.log("This is Manuscript", manuscript)
    if (!manuscript) {
      return res.status(404).json({ error: 'Manuscript not found' });
    }

    const manuscriptMinorFields = manuscript.minorfields;
    console.log("This is Manuscript Minor Fields", manuscriptMinorFields);
    const manuscriptMajorField = manuscript.majorfield;
    console.log("This is Manuscript Major Field", manuscriptMajorField);
    const getReviewers = async () => {
      const allReviewers = await Reviewer.find()
        .populate({
          path: 'user',
          select: 'firstName lastName email profilePicture position degree organisation',
        })
        .select('-_id minorFields majorField user')
        .lean()
        .exec();
      const filteredReviewers = allReviewers.filter(reviewer => reviewer.user !== null);

      const formattedReviewers = filteredReviewers.map((reviewer) => {
        return {
          firstName: reviewer.user.firstName,
          lastName: reviewer.user.lastName,
          position: reviewer.user.position,
          degree: reviewer.user.degree,
          organisation: reviewer.user.organisation,
          email: reviewer.user.email,
          profilePicture: reviewer.user.profilePicture,
          minorFields: reviewer.minorFields,
          majorField: reviewer.majorField,
          verified: true,
        };
      });
      return formattedReviewers;
    };
    const getRecommends = async () => {
      const allRecommends = await Recommend.find().select('-_id firstName lastName position degree organisation email minorFields majorField').lean().exec();
      return allRecommends.map((recommend) => ({
        ...recommend,
        verified: false,
      }));
    };

    const reviewers = await getReviewers();
    console.log("REVIEWERS", reviewers)
    const recommends = await getRecommends();
    console.log("RECOMMENDS", recommends)
    const allCandidates = [...reviewers, ...recommends];

    const recommendedReviewers = allCandidates
      .map(candidate => {
        const matchedMinorFields = candidate.minorFields.filter(field =>
          manuscriptMinorFields.includes(field)
        );
        const majorFieldMatched = manuscriptMajorField === candidate.majorField;
        const score = matchedMinorFields.length + (majorFieldMatched ? 1 : 0);
        return { ...candidate, matchedMinorFields, majorFieldMatched, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    console.log("this is recommended Reviewers", recommendedReviewers);
    res.status(200).json({ recommendedReviewers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getPendingDecisionsByReviewers = async (req, res) => {
  try {
    const { editorId } = req.params;

    // Find manuscripts with the given editor ID and "reviewerAssigned" or "reviewComplete" status
    const manuscripts = await Manuscript.find({
      editor: editorId,
      status: { $in: ['reviewerAssigned', 'reviewComplete'] },
    });

    // Create an async function to fetch review details for a manuscript
    const fetchReviewDetails = async (manuscript) => {
      const reviews = await Review.find({ _id: { $in: manuscript.reviewIds } })
        .populate({
          path: 'reviewer',
          select: 'user',
          populate: {
            path: 'user',
            select: 'firstName lastName',
          },
        })
        .where('reviewstatus')
        .in(['onreq', 'reject', 'pendingreview']);

      if (reviews.length === 0) {
        return null;
      }

      const reviewerNames = reviews.map(
        (review) => `${review.reviewer.user.firstName} ${review.reviewer.user.lastName}`
      );
      const reviewerIDs = reviews.map(
        (review) => review.reviewer._id
      );
      const reviewStatuses = reviews.map((review) => review.reviewstatus);

      return {
        manuscript,
        reviewerNames,
        reviewerIDs,
        reviewStatuses,
      };
    };

    // Fetch review details for each manuscript
    const results = await Promise.all(manuscripts.map(fetchReviewDetails));

    // Filter out null values from the results array
    const filteredResults = results.filter((result) => result !== null);

    res.status(200).json(filteredResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get assigned manuscripts.' });
  }
};
exports.rejectReview = async (req, res) => {
  try {
    const { reviewerId, manuscriptId, editorId } = req.body;
    console.log('reviewer: ', reviewerId, ', editor: ', editorId, ', manuscript: ', manuscriptId)

    // Find and update the review status
    const review = await Review.findOneAndUpdate(
      { reviewer: reviewerId, manuscript: manuscriptId, editor: editorId },
      { reviewstatus: 'reject' },
      { new: true }
    );
    const [editor, reviewer, manuscript] = await Promise.all([
      Editor.findById(editorId).populate('user'),
      Reviewer.findById(reviewerId).populate('user'),
      Manuscript.findById(manuscriptId),
    ]);

    if (!editor || !reviewer || !manuscript) {
      console.log("One of the provided IDs does not exist")
      return res.status(404).json({
        status: 'fail',
        message: 'One of the provided IDs does not exist'
      });
    }
    const notificationContent = `${editor.user.firstName} ${editor.user.lastName} has rejected your review on "${manuscript.title}"`;
    await createNotification(notificationContent, reviewer.user._id);

    // Sending an email to the reviewer with a reminder
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <img src="cid:unique@nodemailer.com" alt="Your Project Logo" style="max-width: 150px; display: block; margin: 20px auto;" />
        <h1 style="font-size: 24px; text-align: center;">Reminder to Review Manuscript</h1>
        <p style="font-size: 18px; line-height: 1.6;">
          Dear ${reviewer.user.firstName},
        </p>
        <p style="font-size: 18px; line-height: 1.6;">
          The Editor ${editor.user.firstName} ${editor.user.lastName} has rejected your review of the manuscript titled "${manuscript.title}". 
        </p>
        <p style="font-size: 18px; line-height: 1.6;">
          Best regards,
        </p>
        <p style="font-size: 18px; line-height: 1.6;">
          ${editor.user.firstName} ${editor.user.lastName}
        </p>
      </div>
    `;

    await sendEmail(reviewer.user.email, 'Review Rejection', emailContent);

    if (!review) {
      return res.status(404).json({
        status: 'fail',
        message: 'No review found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        review,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while rejecting the review',
    });
  }
};
exports.pingReviewer = async (req, res) => {
  const { reviewerId, manuscriptId, editorId } = req.body;
  try {
    const [editor, reviewer, manuscript] = await Promise.all([
      Editor.findById(editorId).populate('user'),
      Reviewer.findById(reviewerId).populate('user'),
      Manuscript.findById(manuscriptId),
    ]);

    if (!editor || !reviewer || !manuscript) {
      console.log("One of the provided IDs does not exist")
      return res.status(404).json({
        status: 'fail',
        message: 'One of the provided IDs does not exist'
      });
    }

    const notificationContent = `${editor.user.firstName} ${editor.user.lastName} wants you to complete your review on "${manuscript.title}"`;


    // Send notification to the reviewer's user ID
    await createNotification(notificationContent, reviewer.user._id);

    // Sending an email to the reviewer with a reminder
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <img src="cid:unique@nodemailer.com" alt="Your Project Logo" style="max-width: 150px; display: block; margin: 20px auto;" />
        <h1 style="font-size: 24px; text-align: center;">Reminder to Review Manuscript</h1>
        <p style="font-size: 18px; line-height: 1.6;">
          Dear ${reviewer.user.firstName},
        </p>
        <p style="font-size: 18px; line-height: 1.6;">
          This is a friendly reminder to complete your review of the manuscript titled "${manuscript.title}". 
        </p>
        <p style="font-size: 18px; line-height: 1.6;">
          Best regards,
        </p>
        <p style="font-size: 18px; line-height: 1.6;">
          ${editor.user.firstName} ${editor.user.lastName}
        </p>
      </div>
    `;

    await sendEmail(reviewer.user.email, 'Manuscript Review Reminder', emailContent);

    res.status(200).json({
      status: 'success',
      message: 'Notification and email sent successfully'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while sending notification and email',
      error: err.message
    });
  }
};

exports.getFinalDecisionByReviewers = async (req, res) => {
  try {
    const { editorId } = req.params;

    const manuscripts = await Manuscript.find({
      editor: editorId,
      status: { $in: ['reviewerAssigned', 'reviewComplete'] },
    });

    const fetchReviewDetails = async (manuscript) => {
      const reviews = await Review.find({ _id: { $in: manuscript.reviewIds } })
        .populate({
          path: 'reviewer',
          select: 'user',
          populate: {
            path: 'user',
            select: 'firstName lastName',
          },
        })
        .where('reviewstatus', 'completed');

      // Check if any reviews with 'completed' status are found
      if (reviews.length === 0) {
        return null;
      }

      const reviewerNames = reviews.map(
        (review) => `${review.reviewer.user.firstName} ${review.reviewer.user.lastName}`
      );

      return {
        manuscript,
        reviewerNames,
      };
    };

    const result = await Promise.all(manuscripts.map(fetchReviewDetails));

    // Filter out any null results before sending the response
    res.status(200).json(result.filter((item) => item !== null));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get assigned manuscripts.' });
  }
};

exports.getCompleteReviewerDecisions = async (req, res) => {
  try {
    const { manuscriptId } = req.params;

    const reviews = await Review.find({
      manuscript: manuscriptId,
      reviewstatus: 'completed',
    })
      .populate({
        path: 'reviewer',
        select: 'user',
        populate: {
          path: 'user',
          select: 'firstName lastName',
        },
      });

    const result = reviews.map(review => ({
      reviewId: review._id,
      manuscriptstatus: review.manuscriptstatus,
      commentstoeditor: review.commentstoeditor,
      commentstoauthor: review.commentstoauthor,
      rating: review.rating,
      figuresquality: review.figuresquality,
      contribution: review.contribution,
      grammatical_status: review.grammatical_status,
      reviewStatus: review.reviewstatus,
      decision: review.manuscriptstatus,
      reviewerName: `${review.reviewer.user.firstName} ${review.reviewer.user.lastName}`,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get completed reviews.' });
  }
};
exports.getManuscriptDetails = async (req, res) => {
  try {
    const manuscriptId = req.params.manuscriptId;
    const manuscript = await Manuscript.findOne({ _id: manuscriptId }, 'title majorfield minorfields');
    res.status(200).json(manuscript);
  } catch (error) {
    console.error("Failed to fetch manuscript details:", error);
    res.status(500).json({ message: "Failed to fetch manuscript details" });
  }
};
exports.patchFinalDecisionByEditor = async (req, res) => {
  try {
    const { manuscriptId } = req.params;
    const { editorComments, commentsFromReviewer, status } = req.body;
    console.log("manuscriptId", manuscriptId);
    console.log("editorComments", editorComments);
    console.log("commentsFromReviewer", commentsFromReviewer);
    console.log("status", status);
    const manuscript = await Manuscript.findByIdAndUpdate(
      manuscriptId,
      {
        $set: {
          commentsFromEditor: editorComments,
          status: status,
        },
        $push: {
          commentsFromReviewer: {
            $each: commentsFromReviewer,
          },
        },
      },
      { new: true }
    );

    if (!manuscript) {
      return res.status(404).send({ message: 'Manuscript not found' });
    }

    // Fetch the author
    const author = await Author.findById(manuscript.author);

    if (!author) {
      return res.status(404).send({ message: 'Author not found' });
    }

    // Fetch the user
    const user = await User.findById(author.user);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Send the notification
    let notificationMessage;

    switch (status) {
      case 'accepted':
        notificationMessage = `Congratulations! Your manuscript titled "${manuscript.title}" is accepted by the editor.`;
        break;
      case 'rejected':
        notificationMessage = `Your manuscript titled "${manuscript.title}" is rejected by the editor.`;
        break;
      case 'minorChanges':
        notificationMessage = `Your editor wants you to make minor changes in your manuscript titled "${manuscript.title}".`;
        break;
      case 'majorChanges':
        notificationMessage = `Your editor wants you to make major changes in your manuscript titled "${manuscript.title}".`;
        break;
      default:
        notificationMessage = `Your manuscript titled "${manuscript.title}" has been updated with the editor's decision: ${status}`;
    }

    // Send the notification
    await createNotification(notificationMessage, user._id);
    res.send(manuscript);
  } catch (error) {
    console.error('Failed to update manuscript:', error);
    res.status(500).send({ message: 'Failed to update manuscript' });
  }
};
exports.getChangesDone = async (req, res) => {
  try {
    const editorId = req.params.editorId;
    const status = 'changesDone';

    // Find manuscripts with "minorChanges" or "majorChanges" status
    const manuscripts = await Manuscript.find({ editor: editorId, status: status })
      .populate({
        path: 'author',
        select: 'user',
        populate: {
          path: 'user',
          select: 'firstName lastName',
        },
      });

    res.status(200).json({ manuscripts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get manuscripts by status.' });
  }
};
exports.finalAcceptByEditor = async (req, res) => {
  try {
    const manuscriptId = req.params.manuscriptId;

    // Fetch the manuscript and update its status
    const manuscript = await Manuscript.findById(manuscriptId).populate({
      path: 'author',
      select: 'user', // Assuming the Author schema has a 'user' field referencing the user ID
    });
    if (!manuscript) {
      return res.status(404).json({ error: 'Manuscript not found' });
    }
    manuscript.status = 'accepted';
    await manuscript.save();
    notification = `Your ${manuscriptId} has been accepted by the editor`
    // Emit the notification event to the user using Socket.IO
    await createNotification(notification, manuscript.author.user);
    res.status(200).json({ message: 'Manuscript accepted and status updated to pendingReview' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);


    const editor = await Editor.findOne({ user: req.params.userId });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
        editor
      }
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: 'fail',
      message: error
    });
  }
};
exports.editProfile = async (req, res) => {
  try {
    const editorId = req.params.editorId;
    console.log('author', editorId)

    const editor = await Editor.findById(editorId);
    if (!editor) {
      return res.status(404).send({ message: "Editor not found" });
    }

    const user = await User.findById(editor.user);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.firstName = req.body.firstName || user.firstName;
    user.middleName = req.body.middleName || user.middleName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.age = req.body.age || user.age;
    user.country = req.body.country || user.country;
    user.state = req.body.state || user.state;
    user.city = req.body.city || user.city;
    user.organisation = req.body.organisation || user.organisation;
    user.degree = req.body.degree || user.degree;
    user.position = req.body.position || user.position;

    if (req.file) {
      user.profilePicture = `http://localhost:8000/public/profile-pictures/${req.file.filename}`;
    }

    await user.save();

    res.status(200).send({ message: "Profile updated successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
};



