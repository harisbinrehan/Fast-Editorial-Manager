const Review = require('../model/reviewModel');
const Notification = require('../model/notificationsModel');
const io = require('../server').io;
const myEmitter = require('../utils/eventEmmiter');
const Manuscript = require("../model/manuscriptModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Reviewer = require("../model/reviewerModel");
const User = require("../model/userModel");
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

exports.acceptRequest = async (req, res) => {
    try {
        const { manuscriptId, reviewerId, editoruserId } = req.body;
        console.log("manuscriptId", manuscriptId, "reviewerId", reviewerId, "editoruserId", editoruserId)
        // Fetch the manuscript
        const manuscript = await Manuscript.findById(manuscriptId);
        console.log("manuscript", manuscript)
        // Fetch the reviewer
        const reviewer = await Reviewer.findOne({ _id: reviewerId }).populate('user');
        console.log("reviewer", reviewer);
        // Check if manuscript and reviewer exist
        if (!manuscript || !reviewer) {
            return res.status(404).json({ message: 'Manuscript or reviewer not found.' });
        }

        const review = await Review.findOne({ manuscript: manuscriptId, reviewer: reviewerId, reviewstatus: 'onreq' });
        console.log(review);
        if (!review) {
            return res.status(404).json({ message: 'Review request not found.' });
        }

        // Update the review status to 'pendingreview'
        review.reviewstatus = 'pendingreview';
        await review.save();

        // Update the notification content
        await createNotification(`Manuscript titled "${manuscript.title}" was accepted by Reviewer "${reviewer.user.firstName} ${reviewer.user.lastName}"`, editoruserId);

        res.status(200).json({ message: 'Review request accepted and editor notified', data: { reviewId: review._id } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to accept the request.', error: error.message });
    }
};
exports.rejectRequest = async (req, res) => {
    try {
        const { manuscriptId, reviewerId, editoruserId } = req.body;

        // Assuming the reviewer ID is stored in req.user._id (replace with your actual implementation)
        // Fetch the manuscript
        const manuscript = await Manuscript.findById(manuscriptId);

        // Fetch the reviewer
        const reviewer = await Reviewer.findOne({ _id: reviewerId }).populate('user');

        // Check if manuscript and reviewer exist
        if (!manuscript || !reviewer) {
            return res.status(404).json({ message: 'Manuscript or reviewer not found.' });
        }
        const review = await Review.findOne({ manuscript: manuscriptId, reviewer: reviewerId, reviewstatus: 'onreq' });

        if (!review) {
            return res.status(404).json({ message: 'Review request not found.' });
        }

        // Update the review status to 'accepted'
        review.reviewstatus = 'reject';
        await review.save();
        await createNotification(`Manuscript titled "${manuscript.title}" was rejected by Reviewer "${reviewer.user.firstName} ${reviewer.user.lastName}"`, editoruserId);
        res.status(200).json({ message: 'Review request rejected and editor notified.', data: { reviewId: review._id } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to reject the request.', error: error.message });
    }
};
exports.acceptRejectUrl = async (req, res) => {
    try {
        const { reviewId } = req.body;
        const { action } = req.query;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        if (action === 'accept') {
            review.reviewStatus = 'pendingreview';
        } else if (action === 'reject') {
            review.reviewStatus = 'reject';
        } else {
            return res.status(400).json({ message: 'Invalid action.' });
        }

        await review.save();

        res.status(200).json({ message: 'Review status updated.', data: { review } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update review status.', error: error.message });
    }
};

exports.submitReview = async (req, res) => {
    try {
        const { reviewerId, manuscriptId, manuscriptstatus, commentstoeditor, commentstoauthor, rating, figuresquality, contribution, grammatical_status } = req.body;

        const review = await Review.findOne({ reviewer: reviewerId, manuscript: manuscriptId });

        if (!review) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        // Update the review properties
        review.manuscriptstatus = manuscriptstatus;
        review.commentstoeditor = commentstoeditor;
        review.commentstoauthor = commentstoauthor;
        review.rating = rating;
        review.figuresquality = figuresquality;
        review.contribution = contribution;
        review.grammatical_status = grammatical_status;
        review.reviewstatus = 'completed';

        await review.save();

        // Find the manuscript and update its status
        const manuscript = await Manuscript.findById(manuscriptId);

        if (manuscript) {
            manuscript.status = 'reviewComplete';
            await manuscript.save();
        }

        res.status(200).json({ message: 'Review submitted successfully.', data: { reviewId: review._id } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to submit the review.', error: error.message });
    }
};

exports.getReviewRequests = async (req, res) => {
    const { reviewerId } = req.params;

    try {
        const reviews = await Review.find({ reviewer: reviewerId, reviewstatus: "onreq" })
            .populate({
                path: 'manuscript',
            })
            .populate({
                path: 'editor',
                select: '-countOfAcceptedPapers -countOfassigningreviewes -countOfPendingPapers -field -__v',
                populate: {
                    path: 'user',
                    select: 'firstName lastName',
                },
            });

        res.status(200).json({
            status: "success",
            data: {
                reviews,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to retrieve review requests.",
            error,
        });
    }
};
exports.getPendingReview = async (req, res) => {
    const { reviewerId } = req.params;

    try {
        const reviews = await Review.find({ reviewer: reviewerId, reviewstatus: "pendingreview" })
            .populate({
                path: 'manuscript',
            })
            .populate({
                path: 'editor',
                select: '-countOfAcceptedPapers -countOfassigningreviewes -countOfPendingPapers -field -__v',
                populate: {
                    path: 'user',
                    select: 'firstName lastName',
                },
            });

        res.status(200).json({
            status: "success",
            data: {
                reviews,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to retrieve review requests.",
            error,
        });
    }
};
exports.getCompletedReviews = async (req, res) => {
    const { reviewerId } = req.params;

    try {
        const reviews = await Review.find({ reviewer: reviewerId, reviewstatus: "completed" })
            .populate({
                path: 'manuscript',
            })
            .populate({
                path: 'editor',
                select: '-countOfAcceptedPapers -countOfassigningreviewes -countOfPendingPapers -field -__v',
                populate: {
                    path: 'user',
                    select: 'firstName lastName',
                },
            });

        res.status(200).json({
            status: "success",
            data: {
                reviews,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to retrieve review requests.",
            error,
        });
    }
};
exports.getUser = async (req, res) => {
    try {
        const reviewerId = req.params.reviewerId;

        const reviewer = await Reviewer.findById(reviewerId);
        if (!reviewer) {
            return res.status(404).send({ message: "Reviewer not found" });
        }

        const user = await User.findById(reviewer.user);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const response = {
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            email: user.email,
            age: user.age,
            country: user.country,
            state: user.state,
            city: user.city,
            organisation: user.organisation,
            degree: user.degree,
            position: user.position,
            profilePicture: user.profilePicture,
            majorField: reviewer.majorField,
            minorFields: reviewer.minorFields
        }

        res.status(200).send(response);

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Server error" });
    }
};

exports.editProfile = async (req, res) => {
    try {
        const reviewerId = req.params.reviewerId;
        console.log('reviewer', reviewerId)

        const reviewer = await Reviewer.findById(reviewerId);
        if (!reviewer) {
            return res.status(404).send({ message: "Reviewer not found" });
        }
        console.log('reviewer', reviewer)
        const user = await User.findById(reviewer.user);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        console.log('user', user)
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

        if (req.body.majorField) {
            reviewer.majorField = req.body.majorField;
        }

        if (req.body.minorFields) {
            reviewer.minorFields = req.body.minorFields.split(',');
        }

        if (req.file) {
            user.profilePicture = `http://localhost:8000/public/profile-pictures/${req.file.filename}`;
            console.log('user', user.profilePicture)
        }

        await user.save();
        await reviewer.save();

        res.status(200).send({ message: "Profile updated successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Server error" });
    }
};



