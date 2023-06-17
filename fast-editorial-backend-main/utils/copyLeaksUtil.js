const {
  Copyleaks,
  CopyleaksFileSubmissionModel,
} = require("plagiarism-checker");
const path = require("path");
const fs = require("fs");

const checkPlagiarism = async (obj) => {
  try {
    const copyleaks = new Copyleaks();
    const loginResponse = await copyleaks.loginAsync(
      process.env.COPYLEAKS_EMAIL_ID,
      process.env.COPYLEAKS_API_KEY
    );
    if (loginResponse.access_token) {
      logSuccess("loginAsync", loginResponse);
      let base64String;
      let path = convertPath(obj.path)
      try {
        const data = fs.readFileSync(path);
        base64String = Buffer.from(data).toString("base64");
        console.log("File Read!");
      } catch (e) {
        console.log("Error reading file!", e.message);
      }
      const fileName = obj.title + '.pdf'; //replace with filename
      const manuscriptId = obj.manId.toString() //uuid4(); //replace with manuscript ID obj.manId.toString();
      // Encode the PDF data as Base64
      console.log(fileName, manuscriptId)
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
          // console.log("Plagiarism checked successfully")

          return true;
        },
        (err) => {
          logError("submitFileAsync", err);
          throw new Error(err);
        }
      )
    } else {
      logError("loginAsync", loginResponse);
      throw new Error(loginResponse.message);
    }
  } catch (e) {
    console.error(e);
    throw new Error(e.message)
  }
}
function convertPath(filePath) {
  const prefix = 'http://localhost:8000/';

  // if (filePath.startsWith(prefix)) {
  return filePath.slice(prefix.length);
  // }

  // return url;
}
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

module.exports = { checkPlagiarism }