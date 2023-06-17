////1 upload files func

exports.uploadFiles = async (req, res) => {
    try {
        if (!req.files.manuscript || !req.files.authorPhoto) {
            return res
                .status(400)
                .json({ message: 'Both manuscript and author photo are required.' });
        }

        const manuscriptPath = req.files.manuscript[0].path;
        const authorPhotoPath = req.files.authorPhoto[0].path;

        const dataBuffer = fs.readFileSync(manuscriptPath);
        const pdfData = await pdfParse(dataBuffer);

        // Replace multiple spaces with single spaces
        const normalizedText = pdfData.text.replace(/\s{2,}/g, ' ');
        console.log(normalizedText);
        const abstractRegex = /(?:abstract|summary)(?::|\s)([\s\S]*?)(?=\n(?:\d+\.?\s)?(?:introduction|keywords|background))/i;
        const abstractMatch = normalizedText.match(abstractRegex);
        const abstract = abstractMatch ? abstractMatch[1].trim() : '';

        let manuscript;
        if (req.body.manuscriptId) {
            manuscript = await Manuscript.findByIdAndUpdate(req.body.manuscriptId, {
                manuscript: manuscriptPath,
                authorPhoto: authorPhotoPath,
                abstract: abstract,
            });
        } else {
            manuscript = new Manuscript({
                manuscript: manuscriptPath,
                authorPhoto: authorPhotoPath,
                abstract: abstract,
            });
            manuscript.status = 'draft';
            await manuscript.save();
        }

        res.status(201).json({
            message: 'Files uploaded successfully.',
            data: {
                manuscriptId: manuscript._id,
                manuscriptFile: manuscriptPath,
                authorPhoto: authorPhotoPath,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};



// exports.uploadFiles = async (req, res) => {
//   try {
//     // Validate the presence of both manuscript and author photo files
//     if (!req.files.manuscript || !req.files.authorPhoto) {
//       return res
//         .status(400)
//         .json({ message: "Both manuscript and author photo are required." });
//     }

//     // Get the file paths from the request
//     const manuscriptPath = req.files.manuscript[0].path;
//     const authorPhotoPath = req.files.authorPhoto[0].path;

//     // Read the PDF file
//     const dataBuffer = fs.readFileSync(manuscriptPath);
//     const pdfData = await pdfParse(dataBuffer);

//     // Extract the abstract from the PDF text
//     const abstractRegex =
//       /(?:abstract|summary)\s*([\s\S]*?)\n(?:introduction|keywords|background)/i;
//     const abstractMatch = pdfData.text.match(abstractRegex);
//     const abstract = abstractMatch ? abstractMatch[1].trim() : "";

//     // Create a new Manuscript instance
//     let manuscript;
//     if (req.body.manuscriptId) {
//       manuscript = await Manuscript.findByIdAndUpdate(req.body.manuscriptId, {
//         manuscript: manuscriptPath,
//         authorPhoto: authorPhotoPath,
//         abstract: abstract,
//       });
//     } else {
//       manuscript = new Manuscript({
//         // Add other fields as needed (e.g., title, author, etc.)
//         manuscript: manuscriptPath,
//         authorPhoto: authorPhotoPath,
//         abstract: abstract,
//         // Add other fields as needed (e.g., correspondingAuthor, correspondingAuthorEmail, etc.)
//       });
//       manuscriptPath.status = 'draft';
//       await manuscript.save();
//     }

//     // Return a successful response
//     res.status(201).json({
//       message: "Files uploaded successfully.",
//       data: {
//         manuscriptId: manuscript._id,
//         manuscriptFile: manuscriptPath,
//         authorPhoto: authorPhotoPath,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// };

////////////2//////////

exports.uploadFiles = async (req, res) => {
    try {
        if (!req.files.manuscript || !req.files.authorPhoto) {
            return res
                .status(400)
                .json({ message: "Both manuscript and author photo are required." });
        }

        const manuscriptPath = req.files.manuscript[0].path;
        const authorPhotoPath = req.files.authorPhoto[0].path;

        const dataBuffer = fs.readFileSync(manuscriptPath);
        const pdfData = await pdfParse(dataBuffer);

        const extractAbstract = (text) => {
            const abstractRegex = /(?:abstract|summary)(?::|\s)[\s\S]*?(?=\n(?:introduction|keywords|background|1\s))/i;
            const abstractMatch = text.match(abstractRegex);
            return abstractMatch ? abstractMatch[0].replace(/(?:abstract|summary)(?::|\s)/i, "").trim() : "";
        };

        const extractAbstractFallback = async (filePath) => {
            return new Promise((resolve, reject) => {
                extract(filePath, { splitPages: false }, (err, text) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(extractAbstract(text.join(" ")));
                    }
                });
            });
        };

        let abstract = extractAbstract(pdfData.text);

        if (!abstract) {
            abstract = await extractAbstractFallback(manuscriptPath);
        }

        let manuscript;
        if (req.body.manuscriptId) {
            manuscript = await Manuscript.findByIdAndUpdate(req.body.manuscriptId, {
                manuscript: manuscriptPath,
                authorPhoto: authorPhotoPath,
                abstract: abstract,
            });
        } else {
            manuscript = new Manuscript({
                manuscript: manuscriptPath,
                authorPhoto: authorPhotoPath,
                abstract: abstract,
            });
            manuscript.status = "draft";
            await manuscript.save();
        }

        res.status(201).json({
            message: "Files uploaded successfully.",
            data: {
                manuscriptId: manuscript._id,
                manuscriptFile: manuscriptPath,
                authorPhoto: authorPhotoPath,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to upload files." });
    }
};


exports.signup = async (req, res, next) => {
    try {
        const data = req.body;
        if (!data.name || !data.email || !data.password || !data.passwordConfirm) {
            return next(new AppError('Please provide name, email and password!', 400));
        }
        const user = await User.findOne({ email: data.email });
        console.log(user)
        if (user) {
            return next(new AppError('User already exists!', 400));
        }
        const author = await Author.create({ countOfAcceptedPapers: 0, countOfRejectedPapers: 0, countOfSubmittedPapers: 0 });
        let reviewer = null;
        if (data.isReviewer) {
            reviewer = new Reviewer({ fields: data.fields, majorField: data.majorField });
            await reviewer.save();
        }
        const newUser = await User.create({ ...data, author: author._id, reviewer: reviewer ? reviewer._id : null });
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser,
            },
        });

    } catch (err) {
        next(err);
    }
}


// exports.testing = async (req, res) => {
//   try {
//     if (!req.files.manuscript || !req.files.authorPhoto) {
//       return res.status(400).json({ message: 'Both manuscript and author photo are required.' });
//     }

//     // Get the file paths from the request
//     const manuscriptPath = req.files.manuscript[0].path;
//     const authorPhotoPath = req.files.authorPhoto[0].path;

//     const plagiarismPercentage = await checkPlagiarism(manuscriptPath);
//     res.status(200).json({
//       message: 'test successfully.',
//       plagiarismPercentage,
//     });
//   }
//   catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'messege in catch block' });
//   }
// }




// const checkPlagiarism = async (filePath) => {
//   try {
//     // Submit the file for a plagiarism check

//     const loginResponse = await copyleaks.loginAsync(API_EMAIL, API_KEY);
//     const accessToken = loginResponse.access_token;

//     // Manually set the access token in the Copyleaks instance
//     copyleaks.setAccessToken(accessToken);

//     const response = await copyleaks.submitFileAsync(
//       filePath,
//       null, // No callback URL
//       {
//         'properties': {
//           'title': 'Manuscript Plagiarism Check',
//         },
//       },
//     );

//     const processId = response.processId;

//     // Wait for the plagiarism check to complete
//     const result = await copyleaks.waitForCompletion(processId);

//     // Get the plagiarism percentage from the results
//     const plagiarismPercentage = result.pct;
//     return plagiarismPercentage;
//   } catch (error) {
//     console.error('Error checking plagiarism:', error);
//     throw new Error('Failed to check plagiarism');
//   }
// };
exports.recommendReviewers = async (req, res) => {
    try {
        const { majorField, minorFields } = req.body;

        // Fetch reviewers from both databases
        const reviewers = await Reviewer.find({ majorField });
        const recommends = await Recommend.find({ majorField });

        // Combine the reviewers and recommends into a single array
        const allReviewers = [
            ...reviewers.map((reviewer) => ({ ...reviewer, verified: true })),
            ...recommends.map((recommend) => ({ ...recommend, verified: false })),
        ];

        // Match reviewers based on minor fields
        const matchedReviewers = allReviewers
            .map((reviewer) => {
                const matches = reviewer.minorFields.filter((field) =>
                    minorFields.includes(field)
                );
                return { ...reviewer, matches };
            })
            .sort((a, b) => b.matches.length - a.matches.length)
            .slice(0, 3);

        res.status(200).json({ reviewers: matchedReviewers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.recommendReviewers = async (req, res) => {
    try {
        const manuscriptId = req.params.manuscriptId;
        const manuscript = await Manuscript.findById(manuscriptId);

        if (!manuscript) {
            return res.status(404).json({ error: 'Manuscript not found' });
        }

        const manuscriptMinorFields = manuscript.minorfields;
        const manuscriptMajorField = manuscript.majorfield;
        console.log("sdkomcksdmcksdmcmscmsdcmsm", manuscriptMinorFields, manuscriptMajorField)

        const getReviewers = async () => {
            const allReviewers = await Reviewer.find()
                .populate({
                    path: 'user',
                    select: 'firstName lastName email profilePicture position degree institution',
                })
                .select('-_id minorFields majorField user')
                .lean()
                .exec();
            const filteredReviewers = allReviewers.filter(reviewer => reviewer.user !== null); // Filter out reviewers with a null user
            const formattedReviewers = filteredReviewers.map((reviewer) => {
                return {
                    name: `${reviewer.user.firstName} ${reviewer.user.lastName}`,
                    position: reviewer.user.position,
                    degree: reviewer.user.degree,
                    institution: reviewer.user.institution,
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
            const allRecommends = await Recommend.find().select('-_id name position degree institution email minorFields majorField').lean().exec();
            return allRecommends.map((recommend) => ({
                ...recommend,
                verified: false,
            }));
        };

        const reviewers = await getReviewers();
        const recommends = await getRecommends();
        const allCandidates = [...reviewers, ...recommends];
        console.log(allCandidates)
        const recommendedReviewers = allCandidates
            .map((candidate) => {
                const matchedMinorFields = candidate.minorFields.filter((field) =>
                    manuscriptMinorFields.includes(field)
                );
                const majorFieldMatched = manuscriptMajorField === candidate.majorField;
                return {
                    ...candidate,
                    matchedMinorFields,
                    majorFieldMatched,
                };
            })
            .sort((a, b) => b.matchedMinorFields.length - a.matchedMinorFields.length || (a.majorFieldMatched ? -1 : 0))
            .slice(0, 3);

        res.status(200).json({ recommendedReviewers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// const { Copyleaks } = require('plagiarism-checker');

// const API_KEY = '18c98b73-ffc4-401f-a16c-3b35e1442ab6';
// const API_EMAIL = 'moizshahid3406@gmail.com';

// let copyleaks = new Copyleaks();
// copyleaks.login(API_EMAIL, API_KEY);



// const copyleaks = new Copyleaks();
// const loginResponse = await copyleaks.loginAsync(
//   process.env.COPYLEAKS_EMAIL_ID,
//   process.env.COPYLEAKS_API_KEY
// );
// if (loginResponse.access_token) logSuccess("loginAsync", loginResponse);
// const model = new CopyleaksExportModel(
//   `${process.env.WEBHOOK_URL}/copyleaks/export`,
//   [
//     // results
//     {
//       id: req.body.results.internet[0].id, // change this with your own result Id
//       endpoint: `${process.env.WEBHOOK_URL}/copyleaks/export/${scanId}/result/${req.body.results.internet[0].id}`,
//       verb: "POST",
//       headers: [
//         ["key", "value"],
//         ["key2", "value2"],
//       ],
//     },
//   ],
//   {
//     endpoint: `${process.env.WEBHOOK_URL}/copyleaks/export/${scanId}/completion`,
//     verb: "POST"
//   }
// );

// copyleaks.exportAsync(loginResponse, scanId, scanId, model).then(
//   (res) => logSuccess("exportAsync", res),
//   (err) => {
//     logError("exportAsync", err);
//   }

// exports.exportPdf = async = (req, res, next) => {
//   try {
//     console.log("in pdfExport", req.body);
//     res.status(200).json({ message: "pdfExport" });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({
//       message: "Failed to process pdfExport",
//       error: e.message,
//     });
//   }
// };

// exports.exportStatus = async = (req, res, next) => {
//   try {
//     console.log("in exproStatus", req.body);
//     res.status(200).json({ message: "exportStstus" });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({
//       message: "Failed to process pdfExport",
//       error: e.message,
//     });
//   }
// };