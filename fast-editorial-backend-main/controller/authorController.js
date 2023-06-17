const Manuscript = require("../model/manuscriptModel");
// const Author = require("../model/authorModel");
const Recommend = require("../model/recommend");
const User = require("../model/userModel");
const Author = require("../model/authorModel");
const AppError = require("../utils/appError");
const pdfParse = require("pdf-parse");
const multer = require("multer");
const path = require("path");
const axios = require("axios");
const fs = require("fs");
const Editor = require("../model/editorModel");
const Reviewer = require("../model/reviewerModel");
const sendEmail = require("../utils/sendEmail")
const nodemailer = require('nodemailer');
const { log } = require("console");
const Notification = require('../model/notificationsModel');
const io = require('../server').io;
const myEmitter = require('../utils/eventEmmiter');
const { checkPlagiarism } = require("../utils/copyLeaksUtil");

const createNotification = async (message, userId) => {
  const notification = new Notification({ message: message, recipient: userId, read: false });
  await notification.save();
  myEmitter.emit('notification', notification, userId.toString());
};
const manuscriptDir = path.join(__dirname, "..", "public", "manuscripts");
const authorPhotoDir = path.join(__dirname, "..", "public", "author_photos");
const profilePictureDir = path.join(__dirname, "..", "public", "profile-pictures");
const authorBiographyDir = path.join(__dirname, "..", "public", "author-biographies");
if (!fs.existsSync(manuscriptDir)) {
  fs.mkdirSync(manuscriptDir, { recursive: true });
}

if (!fs.existsSync(authorPhotoDir)) {
  fs.mkdirSync(authorPhotoDir, { recursive: true });
}
if (!fs.existsSync(profilePictureDir)) {
  fs.mkdirSync(profilePictureDir, { recursive: true });
}
if (!fs.existsSync(authorBiographyDir)) {
  fs.mkdirSync(authorBiographyDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "manuscript") {
      cb(null, path.join(__dirname, "..", "public", "manuscripts"));
    } else if (file.fieldname === "authorPhoto") {
      cb(null, path.join(__dirname, "..", "public", "author_photos"));
    } else if (file.fieldname === "profilePicture") {
      cb(null, profilePictureDir);
    }
    else if (file.fieldname === "authorBiography") {
      cb(null, authorBiographyDir);
    }
    else {
      cb({ error: "Invalid fieldname" }, false);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

exports.upload = upload;

exports.uploadFiles = async (req, res) => {
  try {

    // Validate the presence of both manuscript and author photo files
    if (!req.files.manuscript || !req.files.authorPhoto) {
      return res
        .status(400)
        .json({ message: "Both manuscript and author photo are required." });
    }

    if (!req.body.authorId) {
      return res.status(400).json({ message: "Author ID is required." });
    }
    // Get the file paths from the request
    let authorBiographyPath = "";
    let authorBiographyPathURL = "";

    if (req.files.authorBiography) {
      authorBiographyPath = req.files.authorBiography[0].path;
      authorBiographyPathURL = req.files.authorBiography[0].path.replace(/\\/g, '/').replace(/^.*public/, 'http://localhost:8000/public');
    }
    const manuscriptPath = req.files.manuscript[0].path;
    const authorPhotoPath = req.files.authorPhoto[0].path;
    const manuscriptPathURL = req.files.manuscript[0].path.replace(/\\/g, '/').replace(/^.*public/, 'http://localhost:8000/public');
    const authorPhotoPathURL = req.files.authorPhoto[0].path.replace(/\\/g, '/').replace(/^.*public/, 'http://localhost:8000/public');


    // Read the PDF file
    const dataBuffer = fs.readFileSync(manuscriptPath);
    const pdfData = await pdfParse(dataBuffer);

    abstractRegex = /(?:abstract|summary)(?::|\s)([\s\S]*?)(?=\n(?:\d+\.?\s)?(?:introduction|keywords|background))/i;
    const abstractMatch = pdfData.text.match(abstractRegex);
    const abstract = abstractMatch ? abstractMatch[1].trim() : "";

    // Create a new Manuscript instance
    let manuscript;
    if (req.body.manuscriptId && req.body.manuscriptId !== 'null') {
      manuscript = await Manuscript.findByIdAndUpdate(req.body.manuscriptId, {
        manuscript: manuscriptPathURL,
        authorPhoto: authorPhotoPathURL,
        authorBiography: authorBiographyPathURL ? authorBiographyPathURL : manuscript.authorBiography,
        abstract: abstract,
        author: req.body.authorId,
      });
    } else {
      manuscript = new Manuscript({
        manuscript: manuscriptPathURL,
        authorPhoto: authorPhotoPathURL,
        abstract: abstract,
        authorBiography: authorBiographyPathURL,
        author: req.body.authorId,
      });
      manuscript.status = 'draft';
      await manuscript.save();
    }

    res.status(201).json({
      message: "Files uploaded successfully.",
      data: {
        manuscriptId: manuscript._id,
        manuscriptFile: manuscriptPath,
        authorPhoto: authorPhotoPath,
        authorBiography: authorBiographyPath,
        abstract: abstract ? abstract : false
      },
    });
  } catch (error) {
    console.error('this is the error', error);
    res.status(500).json({ message: "Internal server error." });
  }
};
exports.fillForm = async (req, res) => {
  try {
    const {
      manuscriptId,
      title,
      abstract,
      minorfields,
      majorfield,
      correspondingAuthorName,
      correspondingAuthorPhone,
      correspondingAuthorEmail,
    } = req.body;
    console.log("Received request payload:", req.body);

    if (!manuscriptId) {
      return res.status(400).json({ message: "Manuscript ID is required." });
    }

    const manuscript = await Manuscript.findById(manuscriptId);

    if (!manuscript) {
      return res.status(404).json({ message: "Manuscript not found." });
    }

    manuscript.title = title;
    if (abstract) {
      manuscript.abstract = abstract;
    }
    // manuscript.author = author;
    manuscript.minorfields = minorfields;
    manuscript.majorfield = majorfield;
    manuscript.correspondingAuthorName = correspondingAuthorName;
    manuscript.correspondingAuthorPhone = correspondingAuthorPhone;
    manuscript.correspondingAuthorEmail = correspondingAuthorEmail;
    await manuscript.save();
    res.status(200).json({
      message: "Form details saved successfully.",
      data: manuscript,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.additionalComments = async (req, res) => {
  try {
    const { manuscriptId, additionalComments } = req.body;
    console.log(additionalComments)
    if (!manuscriptId) {
      return res.status(400).json({ message: "Manuscript ID is required." });
    }
    if (!additionalComments) {
      return res.status(400).json({ message: "Manuscript ID is required." });
    }
    const manuscript = await Manuscript.findById(manuscriptId);
    console.log(manuscript)

    if (!manuscript) {
      return res.status(404).json({ message: "Manuscript not found." });
    }
    // const validComments = additionalComments.filter(comment => comment != null);

    manuscript.additionalComments.push(additionalComments);
    await manuscript.save();

    res.status(200).json({
      message: "Additional comment saved successfully.",
      data: manuscript,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.addRecommendReviewers = async (req, res) => {
  try {
    // Splitting name into first and last names
    const fullName = req.body.name.split(' ');
    const firstName = fullName[0];
    const lastName = fullName.slice(1).join(' ');  // Assuming rest part of the split array as last name

    // Removing name field from req.body
    delete req.body.name;

    const newrecommend = await Recommend.create({
      ...req.body,
      firstName: firstName,
      lastName: lastName,
    });

    await newrecommend.save();

    // Find the manuscript and update the recommendedReviewers array
    const manuscript = await Manuscript.findById(newrecommend.manuscript);
    if (!manuscript) {
      return res.status(404).json({ message: "Manuscript not found." });
    }
    manuscript.recommendedReviewers.push(newrecommend._id);
    await manuscript.save();

    res.status(200).json({
      message: "Recommended a reviewer successfully.",
      reviewerId: newrecommend._id,
      manuscriptId: newrecommend.manuscript
    });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ message: "Failed to recommend reviewer.", error: e.message });
  }
};


exports.getRecommendedReviewers = async (req, res) => {
  try {
    const list = await Recommend.find({ manuscript: req.params.id }).lean();
    res.status(200).json({
      recommendedReviewers: list,
    });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ message: "Failed to get reviewer.", error: e.message });
  }
};
exports.getManuscript = async (req, res) => {
  try {
    const manuscript = await Manuscript.findById(req.params.id).lean();
    res.status(200).json({
      manuscript,
    });
  } catch (e) {
    cosnsole.error(e);
    res.status(500).json({ message: "Failed to get manuscript.", error: e.message });
  }
}
exports.submitManuscript = async (req, res) => {
  try {
    const manuscript = await Manuscript.findById(req.params.id).populate({
      path: 'author',
      populate: { path: 'user' },
    });;

    if (!manuscript) {
      return res.status(404).json({ message: 'Manuscript not found.' });
    }
    console.log(manuscript.majorfield);

    // Check if all required fields are filled in
    const requiredFields = [
      'title',
      'abstract',
      'minorfields',
      'majorfield',
      'correspondingAuthorName',
      'correspondingAuthorPhone',
      'correspondingAuthorEmail',
      'additionalComments',
    ];
    console.log(manuscript)
    for (const field of requiredFields) {
      if (!manuscript[field] || (Array.isArray(manuscript[field]) && manuscript[field].length === 0)) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    await checkPlagiarism({ title: manuscript.title, manId: manuscript._id, path: manuscript.manuscript });

    // Find an editor with matching majorfields
    const editor = await Editor.findOne({ field: { $in: manuscript.majorfield } });

    if (!editor) {
      return res.status(404).json({ message: 'No matching editor found.' });
    }

    // Update the manuscript with the editor ID and set the status to 'submitted'
    manuscript.editor = editor._id;
    manuscript.status = 'submitted';
    await manuscript.save();
    const authorUser = manuscript.author.user;
    const message = `New manuscript submitted by ${authorUser.firstName} ${authorUser.lastName}.`;
    createNotification(message, editor.user);
    const emailContent = `
     <div style="text-align: center;">
      <img src="cid:unique@nodemailer.com" alt="Your Project Logo" style="max-width: 150px; display: block; margin: 20px auto;" />
      <h1>Dear ${authorUser.firstName} ${authorUser.lastName},</h1>
      </div>
      <p>We are thrilled to inform you that your manuscript titled <strong>${manuscript.title}</strong> has been successfully submitted for review.</p>
      <h2>Manuscript Details:</h2>
      <ul>
        <li><strong>Title:</strong> ${manuscript.title}</li>
        <li><strong>Abstract:</strong> ${manuscript.abstract}</li>
        <li><strong>Corresponding Author Name:</strong> ${manuscript.correspondingAuthorName}</li>
        <li><strong>Corresponding Author Email:</strong> ${manuscript.correspondingAuthorEmail}</li>
      </ul>
      <p>We appreciate your contribution to our platform and assure you that our editors will conduct a fair review process. You will be informed promptly once we have updates on your submission.</p>
      <p>If you have any questions or need further assistance, please feel free to reach out to us.</p>
      <p>Thank you again for choosing our platform for your publication needs.</p>
      <p>Best Regards,</p>
      <p>Your FEM Team</p>
    `;

    // Call the sendEmail function
    await sendEmail(authorUser.email, 'Manuscript Submitted Successfully', emailContent);

    res.status(200).json({
      message: 'Manuscript submitted successfully.',
      manuscript,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to submit manuscript.', error: e.message });
  }
};
exports.getIncompleteSubmissions = async (req, res, next) => {
  try {
    const authorId = req.params.authorId;
    const manuscripts = await Manuscript.find({ author: authorId, status: 'draft' });
    console.log(authorId);
    if (manuscripts.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No manuscripts with draft status found for this author',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        manuscripts,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching draft manuscripts',
    });
  }
};

// Add this function to your author controller
exports.getSubmissionsNeedingRevision = async (req, res) => {
  try {
    const authorId = req.params.authorId;
    const statuses = ['minorChanges', 'majorChanges'];

    // Find manuscripts with "minorChanges" or "majorChanges" status
    const manuscripts = await Manuscript.find({ author: authorId, status: { $in: statuses } })
      .populate({
        path: 'editor',
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
exports.updateManuscriptDetails = async (req, res) => {
  try {
    const {
      manuscriptId,
      title,
      abstract,
      minorfields,
      majorfield,
      correspondingAuthorName,
      correspondingAuthorPhone,
      correspondingAuthorEmail,
    } = req.body;

    if (!manuscriptId) {
      return res.status(400).json({ message: "Manuscript ID is required." });
    }

    const manuscript = await Manuscript.findById(manuscriptId);

    if (!manuscript) {
      return res.status(404).json({ message: "Manuscript not found." });
    }

    // Update manuscript details
    manuscript.title = title;
    manuscript.abstract = abstract;
    manuscript.minorfields = minorfields;
    manuscript.majorfield = majorfield;
    manuscript.correspondingAuthorName = correspondingAuthorName;
    manuscript.correspondingAuthorPhone = correspondingAuthorPhone;
    manuscript.correspondingAuthorEmail = correspondingAuthorEmail;

    // Update manuscript file and author photo if provided
    if (req.files && req.files.manuscript) {
      const manuscriptPath = req.files.manuscript[0].path;
      const manuscriptPathURL = req.files.manuscript[0].path.replace(/\\/g, '/').replace(/^.*public/, 'http://localhost:8000/public');
      manuscript.manuscript = manuscriptPathURL;
    }

    if (req.files && req.files.authorPhoto) {
      const authorPhotoPath = req.files.authorPhoto[0].path;
      const authorPhotoPathURL = req.files.authorPhoto[0].path.replace(/\\/g, '/').replace(/^.*public/, 'http://localhost:8000/public');
      manuscript.authorPhoto = authorPhotoPathURL;
    }
    manuscript.status = 'changesDone';
    await manuscript.save();
    await manuscript
      .populate([
        { path: 'editor', populate: { path: 'user' } },
        { path: 'author', populate: { path: 'user' } },
      ]);

    const authorName = manuscript.author.user.firstName + ' ' + manuscript.author.user.lastName;

    // Create a notification message
    const notificationMessage = `Manuscript with title "${manuscript.title}" by author "${authorName}" has completed the changes.`;

    // Create a notification for the editor
    createNotification(notificationMessage, manuscript.editor.user._id);

    res.status(200).json({
      message: "Manuscript details updated successfully.",
      data: manuscript,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};
exports.getRevisionsBeingProcessed = async (req, res) => {
  try {
    const authorId = req.params.authorId;
    const statuses = ['pendingReview', 'reviewerAssigned', 'reviewComplete'];

    // Find manuscripts with "minorChanges" or "majorChanges" status
    const manuscripts = await Manuscript.find({ author: authorId, status: { $in: statuses } })
      .populate({
        path: 'editor',
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
exports.getDeclined = async (req, res) => {
  try {
    const authorId = req.params.authorId;
    const status = 'rejected';

    // Find manuscripts with "minorChanges" or "majorChanges" status
    const manuscripts = await Manuscript.find({ author: authorId, status: status })
      .populate({
        path: 'editor',
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
exports.getSubmissionsWithDecision = async (req, res) => {
  try {
    const authorId = req.params.authorId;
    const statuses = ['rejected', 'accepted'];

    // Find manuscripts with "minorChanges" or "majorChanges" status
    const manuscripts = await Manuscript.find({ author: authorId, status: { $in: statuses } })
      .populate({
        path: 'editor',
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
exports.completedSubmissions = async (req, res) => {
  try {
    const authorId = req.params.authorId;
    const status = 'submitted';

    // Find manuscripts with "minorChanges" or "majorChanges" status
    const manuscripts = await Manuscript.find({ author: authorId, status: status })
      .populate({
        path: 'editor',
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
exports.editProfile = async (req, res) => {
  try {
    const authorId = req.params.authorId;
    console.log('author', authorId)

    const author = await Author.findById(authorId);
    if (!author) {
      return res.status(404).send({ message: "Author not found" });
    }

    const user = await User.findById(author.user);
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

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);


    const author = await Author.findOne({ user: req.params.userId });
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
        author
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

