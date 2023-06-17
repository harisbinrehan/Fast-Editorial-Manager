const express = require('express');
const router = express.Router();
const reviewerController = require('../controller/reviewerController');
router.get('/get-review-requests/:reviewerId', reviewerController.getReviewRequests);
router.get('/get-pending-reviews/:reviewerId', reviewerController.getPendingReview);
router.get('/current-user/:reviewerId', reviewerController.getUser);
router.put('/edit-profile/:reviewerId', reviewerController.upload.single('profilePicture'), reviewerController.editProfile);
router.get('/get-completed-reviews/:reviewerId', reviewerController.getCompletedReviews);
router.post('/reviewer/accept-reject-url', reviewerController.acceptRejectUrl);

router.patch('/submit-review', reviewerController.submitReview);
router.patch('/accept-request', reviewerController.acceptRequest);
router.patch('/reject-request', reviewerController.rejectRequest);

module.exports = router;
