var express = require("express");
var router = express.Router();
var plagCheckController = require("../controller/plagCheckController");

router.post("/", plagCheckController.checkPlagiarism);
router.post('/completed/', plagCheckController.webhookCompleted);
router.post('/error/', plagCheckController.webhookError);
// router.post('/export/:manID/result/:SCAN_ID', plagCheckController.exportPdf);
// router.post('/export/:manID/completion', plagCheckController.exportPdf);
// router.post('/export', plagCheckController.exportStatus);

// router.post('/creditsChecked/SCAN_ID', plagCheckController.completed);

// https://yoursite.com/copyleaks/completed/SCAN_ID
// https://yoursite.com/copyleaks/error/SCAN_ID
// https://yoursite.com/copyleaks/creditsChecked/SCAN_ID
// router.

module.exports = router;