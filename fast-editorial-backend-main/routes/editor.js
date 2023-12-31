var express = require('express');
var router = express.Router();
const authorController = require('../controller/authorController');
const editorController = require('../controller/editorController');
router.post('/add-editor', editorController.addEditor);
router.post('/assign-reviewer', editorController.assignReviewer);
router.get('/get-new-submissions/:editorId', editorController.getNewSubmissions);
router.get('/get-pending-for-review/:editorId', editorController.getPendingForReview);//assigning reviewers in Frontend with this api
router.get('/recommend-reviewers/:manuscriptId', editorController.recommendReviewers);
router.get('/get-pending-decisions/:editorId', editorController.getPendingDecisionsByReviewers);
router.patch('/reject-review', editorController.rejectReview);
router.post('/ping-reviewer', editorController.pingReviewer);
router.get('/get-final-decisions/:editorId', editorController.getFinalDecisionByReviewers);
router.get('/get-reviewer-decisions/:manuscriptId', editorController.getCompleteReviewerDecisions);
router.get('/get-manuscript/:manuscriptId', editorController.getManuscriptDetails);
router.patch('/final-decision-by-editor/:manuscriptId', editorController.patchFinalDecisionByEditor);
router.get('/get-changes-done/:editorId', editorController.getChangesDone);
router.post('/reject-by-editor/:manuscriptId', editorController.rejectByEditor);
router.put('/accept-by-editor/:manuscriptId', editorController.acceptByEditor);
router.put('/final-accept-by-editor/:manuscriptId', editorController.finalAcceptByEditor);
router.get('/current-user/:userId', editorController.getCurrentUser);
router.put('/edit-profile/:editorId', editorController.upload.single('profilePicture'), editorController.editProfile);
module.exports = router;
