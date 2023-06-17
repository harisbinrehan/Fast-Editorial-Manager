const {
  Copyleaks,
  CopyleaksExportModel,
  CopyleaksFileSubmissionModel,
} = require("plagiarism-checker");
const Manuscript = require("../model/manuscriptModel");
const fs = require("fs");
const uuid4 = require("uuid4");

exports.checkPlagiarism = async (req, res, next) => {
  try {
    const copyleaks = new Copyleaks();
    const loginResponse = await copyleaks.loginAsync(
      process.env.COPYLEAKS_EMAIL_ID,
      process.env.COPYLEAKS_API_KEY
    );
    if (loginResponse.access_token) {
      logSuccess("loginAsync", loginResponse);
      let base64String;
      let path = 'public/manuscripts/1682079989072-233346326-1680346721633-257816958-an-alternative-approach-to-reduce-massive-false-positives-in-mammograms-using-block-variance-of-local-coefficients-features-and-support-vector-machine.pdf'
      // let path = 'public/manuscripts/test.txt'
      try {
        const data = fs.readFileSync(path);
        base64String = Buffer.from(data).toString("base64");
        console.log("File Read!");
      } catch (e) {
        console.log("Error reading file!", e.message);
        next();
      }
      const fileName = "qqweqwe.pdf"//"Network.pdf"; //replace with filename
      const manuscriptId = uuid4(); //replace with manuscript ID
      // Encode the PDF data as Base64

      const submission = new CopyleaksFileSubmissionModel(
        base64String,
        fileName,
        {
          sandbox: true,
          webhooks: {
            status: `${process.env.WEBHOOK_URL}/copyleaks/{STATUS}`,
          },
          pdf: {
            create: true,
          },
        }
      );
      copyleaks.submitFileAsync(loginResponse, manuscriptId, submission).then(
        (resp) => {
          logSuccess("submitFileAsync", resp);
          res.status(200).json({ message: "Plagiarism checked successfully." });
        },
        (err) => {
          logError("submitFileAsync", err);
          res
            .status(500)
            .json({ message: "Failed to check plagiarism.", error: e.message });
        }
      );

      res.status(200);
    } else {
      logError("loginAsync", loginResponse);
      throw new Error(loginResponse.message);
    }
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ message: "Failed to check plagiarism.", error: e.message });
  }
};
function convertPDFToBase64(file) {
  return new Promise((resolve, reject) => {
    fs.readFileSync(file, { encoding: 'base64' }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
exports.webhookCompleted = async (req, res, next) => {
  try {
    console.log("webhookCompleted", req.body);
    res.status(200).json({ message: "webhookCompleted" });

    const manId = req.body.scannedDocument.scanId; // manuscriptId
    const manObj = await Manuscript.findById(manId);
    manObj.plagReport = req.body;
    await manObj.save();
    //mongodb find manuscript document
    //append plag report



    // );
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Failed to process webhookCompleted",
      error: e.message,
    });
  }
};

exports.webhookError = async (req, res, next) => {
  try {
    console.log("webhookError", req.body);
    res.status(200).json({ message: "webhookError" });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ message: "Failed to process webhookError", error: e.message });
  }
};

function logError(title, err) {
  console.error("----------ERROR----------");
  console.error(`${title}:`);
  console.error(err.message);
  console.error("-------------------------");
}

function logSuccess(title, result) {
  console.log("----------SUCCESS----------");
  console.log(`${title}`);
  if (result) {
    console.log(`result:`);
    console.log(result);
  }
  console.log("-------------------------");
}
