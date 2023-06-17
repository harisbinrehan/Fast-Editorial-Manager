var express = require('express');
var router = express.Router();
const authorController = require('../controller/authorController');
// const upload = require('../model/manuscriptModel');

router.put('/edit-profile/:authorId', authorController.upload.single('profilePicture'), authorController.editProfile);
router.get('/recommend-reviewers/:id', authorController.getRecommendedReviewers);
router.put('/manuscript-submit/:id', authorController.submitManuscript);
router.post(
  '/upload-files',
  authorController.upload.fields([
    { name: 'manuscript', maxCount: 1 },
    { name: 'authorPhoto', maxCount: 1 },
    { name: 'authorBiography', maxCount: 1 }
  ]),
  authorController.uploadFiles
);
router.put('/fill-form', authorController.fillForm);
router.post('/recommend-reviewers', authorController.addRecommendReviewers);
router.put('/additional-comments', authorController.additionalComments);
// router.post('/update-manuscript/:id', authorController.updateManuscript);
router.get('/manuscript/:id', authorController.getManuscript);
router.get('/incomplete-submissions/:authorId', authorController.getIncompleteSubmissions);
router.get('/submissions-needing-revision/:authorId', authorController.getSubmissionsNeedingRevision);
router.get('/revisions-being-processed/:authorId', authorController.getRevisionsBeingProcessed);
router.get('/declined/:authorId', authorController.getDeclined);
router.get('/submissions-with-decision/:authorId', authorController.getSubmissionsWithDecision);
router.get('/completed-submissions/:authorId', authorController.completedSubmissions);
router.put(
  '/update-manuscript',
  authorController.upload.fields([{ name: 'manuscript', maxCount: 1 }, { name: 'authorPhoto', maxCount: 1 }]),
  authorController.updateManuscriptDetails
);
router.get('/current-user/:userId', authorController.getCurrentUser);
module.exports = router;
